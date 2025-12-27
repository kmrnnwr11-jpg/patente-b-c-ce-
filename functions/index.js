/**
 * Firebase Cloud Functions per Patente B App
 * 
 * Gestisce:
 * - Pagamenti Stripe (checkout, webhook, cancellazione)
 * - Sistema commissioni creator/referral
 * - Scheduled jobs per commissioni mensili
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Inizializza Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Configurazione Stripe
// IMPORTANTE: Configura le chiavi in Firebase Functions config:
// firebase functions:config:set stripe.secret_key="sk_test_xxx" stripe.webhook_secret="whsec_xxx"
const stripe = require("stripe")(
    functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verifica che la richiesta sia autenticata
 */
async function verifyAuth(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized - No token provided");
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        throw new Error("Unauthorized - Invalid token");
    }
}

// ============================================
// STRIPE CHECKOUT
// ============================================

/**
 * Crea una sessione di checkout Stripe
 * POST /createCheckoutSession
 * Body: { userId, email, priceId, promoCode?, referralCode? }
 */
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            // Verifica autenticazione
            const decodedToken = await verifyAuth(req);

            const { email, priceId, promoCode, referralCode } = req.body;
            const userId = decodedToken.uid;

            // Cerca o crea customer Stripe
            let customer;
            const userDoc = await db.collection("users").doc(userId).get();
            const userData = userDoc.data();

            if (userData?.stripeCustomerId) {
                customer = await stripe.customers.retrieve(userData.stripeCustomerId);
            } else {
                customer = await stripe.customers.create({
                    email: email,
                    metadata: {
                        firebaseUserId: userId,
                    },
                });

                // Salva customer ID in Firestore
                await db.collection("users").doc(userId).update({
                    stripeCustomerId: customer.id,
                });
            }

            // Prepara parametri checkout
            const sessionParams = {
                customer: customer.id,
                payment_method_types: ["card"],
                mode: "subscription",
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: `https://patenteapp.com/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `https://patenteapp.com/cancel`,
                metadata: {
                    userId: userId,
                    promoCode: promoCode || "",
                    referralCode: referralCode || "",
                },
                subscription_data: {
                    metadata: {
                        userId: userId,
                        promoCode: promoCode || "",
                        referralCode: referralCode || "",
                    },
                },
            };

            // Applica sconto referral (20% primo mese)
            if (referralCode) {
                // Crea un coupon temporaneo per il referral
                const coupon = await stripe.coupons.create({
                    percent_off: 20,
                    duration: "once",
                    name: `Referral ${referralCode}`,
                });
                sessionParams.discounts = [{ coupon: coupon.id }];
            }

            // Applica codice promo se presente
            if (promoCode && !referralCode) {
                const promoDoc = await db.collection("promocodes")
                    .where("code", "==", promoCode.toUpperCase())
                    .limit(1)
                    .get();

                if (!promoDoc.empty) {
                    const promo = promoDoc.docs[0].data();
                    if (promo.isActive) {
                        const coupon = await stripe.coupons.create({
                            percent_off: promo.discountType === "percentage" ? promo.discountValue : undefined,
                            amount_off: promo.discountType === "fixed" ? Math.round(promo.discountValue * 100) : undefined,
                            currency: "eur",
                            duration: "once",
                            name: `Promo ${promoCode}`,
                        });
                        sessionParams.discounts = [{ coupon: coupon.id }];
                    }
                }
            }

            const session = await stripe.checkout.sessions.create(sessionParams);

            return res.status(200).json({
                url: session.url,
                sessionId: session.id,
            });
        } catch (error) {
            console.error("Error creating checkout session:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

// ============================================
// STRIPE WEBHOOK
// ============================================

/**
 * Gestisce gli eventi webhook di Stripe
 * POST /stripeWebhook
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`Received event: ${event.type}`);

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutComplete(event.data.object);
                break;

            case "customer.subscription.created":
            case "customer.subscription.updated":
                await handleSubscriptionUpdate(event.data.object);
                break;

            case "customer.subscription.deleted":
                await handleSubscriptionCanceled(event.data.object);
                break;

            case "invoice.payment_succeeded":
                await handlePaymentSucceeded(event.data.object);
                break;

            case "invoice.payment_failed":
                await handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("Error handling webhook:", error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * Gestisce il completamento del checkout
 */
async function handleCheckoutComplete(session) {
    const userId = session.metadata.userId;
    const referralCode = session.metadata.referralCode;
    const promoCode = session.metadata.promoCode;

    console.log(`Checkout completed for user: ${userId}`);

    // Se c'è un referral, aggiorna lo stato
    if (referralCode) {
        const creatorQuery = await db.collection("creators")
            .where("referralCode", "==", referralCode)
            .limit(1)
            .get();

        if (!creatorQuery.empty) {
            const creatorDoc = creatorQuery.docs[0];

            // Aggiorna referral status
            const referralQuery = await db.collection("referrals")
                .where("userId", "==", userId)
                .where("referralCode", "==", referralCode)
                .limit(1)
                .get();

            if (!referralQuery.empty) {
                await referralQuery.docs[0].ref.update({
                    status: "active",
                    dateConverted: admin.firestore.FieldValue.serverTimestamp(),
                    subscriptionId: session.subscription,
                });

                // Aggiorna contatore creator
                await creatorDoc.ref.update({
                    activeSubscriptions: admin.firestore.FieldValue.increment(1),
                    pendingPayout: admin.firestore.FieldValue.increment(6.0), // Prima commissione
                });
            }
        }
    }

    // Aggiorna utilizzo promo code
    if (promoCode) {
        const promoQuery = await db.collection("promocodes")
            .where("code", "==", promoCode.toUpperCase())
            .limit(1)
            .get();

        if (!promoQuery.empty) {
            await promoQuery.docs[0].ref.update({
                currentUses: admin.firestore.FieldValue.increment(1),
                usedByUserIds: admin.firestore.FieldValue.arrayUnion(userId),
            });
        }
    }
}

/**
 * Gestisce aggiornamenti subscription
 */
async function handleSubscriptionUpdate(subscription) {
    const userId = subscription.metadata.userId;

    // Salva/aggiorna subscription in Firestore
    const subscriptionData = {
        userId: userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
        status: subscription.status,
        amount: subscription.items.data[0].price.unit_amount / 100,
        currency: subscription.items.data[0].price.currency.toUpperCase(),
        currentPeriodStart: admin.firestore.Timestamp.fromMillis(subscription.current_period_start * 1000),
        currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        promoCodeUsed: subscription.metadata.promoCode || null,
        referralCodeUsed: subscription.metadata.referralCode || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Cerca subscription esistente
    const existingQuery = await db.collection("subscriptions")
        .where("stripeSubscriptionId", "==", subscription.id)
        .limit(1)
        .get();

    if (existingQuery.empty) {
        // Crea nuova subscription
        subscriptionData.createdAt = admin.firestore.FieldValue.serverTimestamp();
        await db.collection("subscriptions").add(subscriptionData);
    } else {
        // Aggiorna esistente
        await existingQuery.docs[0].ref.update(subscriptionData);
    }

    // Aggiorna stato premium utente
    const isPremium = subscription.status === "active" || subscription.status === "trialing";
    await db.collection("users").doc(userId).update({
        isPremium: isPremium,
        premiumExpiresAt: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
        stripeSubscriptionId: subscription.id,
    });

    console.log(`Subscription ${subscription.id} updated for user ${userId}, premium: ${isPremium}`);
}

/**
 * Gestisce cancellazione subscription
 */
async function handleSubscriptionCanceled(subscription) {
    const userId = subscription.metadata.userId;

    // Aggiorna subscription in Firestore
    const subscriptionQuery = await db.collection("subscriptions")
        .where("stripeSubscriptionId", "==", subscription.id)
        .limit(1)
        .get();

    if (!subscriptionQuery.empty) {
        await subscriptionQuery.docs[0].ref.update({
            status: "canceled",
            canceledAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    // Aggiorna stato utente
    await db.collection("users").doc(userId).update({
        isPremium: false,
    });

    // Aggiorna referral se presente
    const referralCode = subscription.metadata.referralCode;
    if (referralCode) {
        const referralQuery = await db.collection("referrals")
            .where("userId", "==", userId)
            .where("referralCode", "==", referralCode)
            .limit(1)
            .get();

        if (!referralQuery.empty) {
            await referralQuery.docs[0].ref.update({
                status: "canceled",
                dateCanceled: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Decrementa contatore creator
            const creatorQuery = await db.collection("creators")
                .where("referralCode", "==", referralCode)
                .limit(1)
                .get();

            if (!creatorQuery.empty) {
                await creatorQuery.docs[0].ref.update({
                    activeSubscriptions: admin.firestore.FieldValue.increment(-1),
                });
            }
        }
    }

    console.log(`Subscription canceled for user ${userId}`);
}

/**
 * Gestisce pagamento riuscito (per commissioni mensili)
 */
async function handlePaymentSucceeded(invoice) {
    if (!invoice.subscription) return;

    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const referralCode = subscription.metadata.referralCode;

    if (!referralCode) return;

    // Trova il referral e aggiungi commissione
    const referralQuery = await db.collection("referrals")
        .where("userId", "==", subscription.metadata.userId)
        .where("status", "==", "active")
        .limit(1)
        .get();

    if (!referralQuery.empty) {
        const referralDoc = referralQuery.docs[0];
        const referral = referralDoc.data();

        // Massimo 12 mesi di commissioni
        if (referral.monthsPaid < 12) {
            await referralDoc.ref.update({
                monthsPaid: admin.firestore.FieldValue.increment(1),
                totalPaid: admin.firestore.FieldValue.increment(6.0),
                isPaidThisMonth: true,
            });

            // Aggiungi commissione al creator
            const creatorQuery = await db.collection("creators")
                .where("referralCode", "==", referralCode)
                .limit(1)
                .get();

            if (!creatorQuery.empty) {
                await creatorQuery.docs[0].ref.update({
                    pendingPayout: admin.firestore.FieldValue.increment(6.0),
                    totalEarnings: admin.firestore.FieldValue.increment(6.0),
                });
            }

            // Se raggiunto 12 mesi, marca come completato
            if (referral.monthsPaid + 1 >= 12) {
                await referralDoc.ref.update({
                    status: "completed",
                });
            }

            console.log(`Commission added for referral ${referralCode}, month ${referral.monthsPaid + 1}/12`);
        }
    }
}

/**
 * Gestisce pagamento fallito
 */
async function handlePaymentFailed(invoice) {
    if (!invoice.subscription) return;

    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const userId = subscription.metadata.userId;

    // Aggiorna stato subscription
    const subscriptionQuery = await db.collection("subscriptions")
        .where("stripeSubscriptionId", "==", invoice.subscription)
        .limit(1)
        .get();

    if (!subscriptionQuery.empty) {
        await subscriptionQuery.docs[0].ref.update({
            status: "past_due",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    console.log(`Payment failed for user ${userId}`);
}

// ============================================
// CANCEL SUBSCRIPTION
// ============================================

/**
 * Cancella un abbonamento
 * POST /cancelSubscription
 * Body: { subscriptionId }
 */
exports.cancelSubscription = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const decodedToken = await verifyAuth(req);
            const { subscriptionId } = req.body;

            // Verifica che la subscription appartenga all'utente
            const subscriptionQuery = await db.collection("subscriptions")
                .where("stripeSubscriptionId", "==", subscriptionId)
                .where("userId", "==", decodedToken.uid)
                .limit(1)
                .get();

            if (subscriptionQuery.empty) {
                return res.status(404).json({ error: "Subscription not found" });
            }

            // Cancella alla fine del periodo
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true,
            });

            // Aggiorna Firestore
            await subscriptionQuery.docs[0].ref.update({
                cancelAtPeriodEnd: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error canceling subscription:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

// ============================================
// SCHEDULED: RESET MONTHLY FLAGS
// ============================================

/**
 * Esegue ogni primo del mese per resettare i flag mensili
 */
exports.resetMonthlyFlags = functions.pubsub
    .schedule("0 0 1 * *") // Ogni primo del mese a mezzanotte
    .timeZone("Europe/Rome")
    .onRun(async (context) => {
        console.log("Resetting monthly flags...");

        const referralsSnapshot = await db.collection("referrals")
            .where("isPaidThisMonth", "==", true)
            .get();

        const batch = db.batch();
        referralsSnapshot.forEach((doc) => {
            batch.update(doc.ref, { isPaidThisMonth: false });
        });

        await batch.commit();
        console.log(`Reset ${referralsSnapshot.size} referral flags`);
        return null;
    });

// ============================================
// GET SUBSCRIPTION STATUS (Helper)
// ============================================

/**
 * Ottiene lo stato dell'abbonamento per un utente
 * GET /getSubscriptionStatus
 */
exports.getSubscriptionStatus = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const decodedToken = await verifyAuth(req);

            const subscriptionQuery = await db.collection("subscriptions")
                .where("userId", "==", decodedToken.uid)
                .where("status", "in", ["active", "trialing", "past_due"])
                .orderBy("createdAt", "descending")
                .limit(1)
                .get();

            if (subscriptionQuery.empty) {
                return res.status(200).json({ hasSubscription: false });
            }

            const subscription = subscriptionQuery.docs[0].data();
            return res.status(200).json({
                hasSubscription: true,
                subscription: {
                    status: subscription.status,
                    currentPeriodEnd: subscription.currentPeriodEnd.toDate(),
                    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                },
            });
        } catch (error) {
            console.error("Error getting subscription status:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});
