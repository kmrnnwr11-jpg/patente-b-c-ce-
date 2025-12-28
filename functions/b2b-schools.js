/**
 * Firebase Cloud Functions per Sistema B2B Autoscuole
 * 
 * Gestisce:
 * - Registrazione autoscuole
 * - Gestione studenti (inviti, iscrizioni)
 * - Gestione abbonamenti autoscuola
 * - Report e analytics
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Inizializza se non già inizializzato
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();

// Configurazione Stripe
const stripe = require("stripe")(
    functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY
);

// ============================================
// PIANI E PREZZI - 4 Tier come da prompt
// ============================================
const SCHOOL_PLANS = {
    starter: {
        name: "Starter",
        monthlyPrice: 99,
        yearlyPrice: 990,
        maxStudents: 20,
        maxInstructors: 1,
        pricePerStudent: 4.95,
        discountVsB2C: 75,
        extraStudentCost: 4,
        features: {
            customLogo: false,
            advancedReports: false,
            exportReports: false,
            apiAccess: false,
            prioritySupport: false,
            videoLessons: "base",
        },
        support: "email",
    },
    pro: {
        name: "Pro",
        monthlyPrice: 199,
        yearlyPrice: 1990,
        maxStudents: 50,
        maxInstructors: 3,
        pricePerStudent: 3.98,
        discountVsB2C: 80,
        extraStudentCost: 3,
        features: {
            customLogo: true,
            advancedReports: true,
            exportReports: true,
            apiAccess: false,
            prioritySupport: false,
            videoLessons: "all",
        },
        support: "email_chat",
    },
    business: {
        name: "Business",
        monthlyPrice: 349,
        yearlyPrice: 3490,
        maxStudents: 100,
        maxInstructors: 10,
        pricePerStudent: 3.49,
        discountVsB2C: 83,
        extraStudentCost: 2.5,
        features: {
            customLogo: true,
            advancedReports: true,
            exportReports: true,
            apiAccess: false,
            prioritySupport: true,
            videoLessons: "all",
        },
        support: "priority",
    },
    enterprise: {
        name: "Enterprise",
        monthlyPrice: 599,
        yearlyPrice: 5990,
        maxStudents: -1, // Illimitati
        maxInstructors: -1,
        pricePerStudent: 0,
        discountVsB2C: 100,
        extraStudentCost: 0,
        features: {
            customLogo: true,
            advancedReports: true,
            exportReports: true,
            apiAccess: true,
            prioritySupport: true,
            videoLessons: "all_custom",
        },
        support: "dedicated",
    },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Genera codice univoco per autoscuola
 */
function generateSchoolCode(name) {
    const prefix = name
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 4);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
}

/**
 * Genera codice invito per studente
 */
function generateInviteCode() {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `STU-${random}`;
}

/**
 * Verifica autenticazione e restituisce utente
 */
async function verifyAuth(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }
    const idToken = authHeader.split("Bearer ")[1];
    return await admin.auth().verifyIdToken(idToken);
}

/**
 * Verifica che l'utente sia owner o admin dell'autoscuola
 */
async function verifySchoolAccess(userId, schoolId, requiredRole = "instructor") {
    const instructorQuery = await db
        .collection("driving_schools")
        .doc(schoolId)
        .collection("school_instructors")
        .where("userId", "==", userId)
        .where("isActive", "==", true)
        .limit(1)
        .get();

    if (instructorQuery.empty) {
        throw new Error("Access denied - Not a member of this school");
    }

    const instructor = instructorQuery.docs[0].data();
    const roleHierarchy = { owner: 3, admin: 2, instructor: 1 };

    if (roleHierarchy[instructor.role] < roleHierarchy[requiredRole]) {
        throw new Error("Access denied - Insufficient permissions");
    }

    return { instructor, instructorId: instructorQuery.docs[0].id };
}

// ============================================
// REGISTRAZIONE AUTOSCUOLA
// ============================================

/**
 * Registra una nuova autoscuola
 * POST /registerSchool
 */
exports.registerSchool = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const decodedToken = await verifyAuth(req);
            const userId = decodedToken.uid;

            const {
                // Info autoscuola
                name,
                businessName,
                vatNumber,
                email,
                phone,
                address,
                city,
                province,
                postalCode,
                // Piano
                plan = "pro",
                billingCycle = "yearly",
                // Owner
                ownerName,
            } = req.body;

            if (!name || !email || !ownerName) {
                return res.status(400).json({
                    error: "Missing required fields: name, email, ownerName"
                });
            }

            // Verifica che l'utente non abbia già un'autoscuola
            const existingSchool = await db
                .collection("driving_schools")
                .where("ownerId", "==", userId)
                .limit(1)
                .get();

            if (!existingSchool.empty) {
                return res.status(400).json({
                    error: "User already has a driving school"
                });
            }

            // Genera codice univoco
            let schoolCode = generateSchoolCode(name);
            let codeExists = true;
            let attempts = 0;

            while (codeExists && attempts < 10) {
                const existing = await db
                    .collection("driving_schools")
                    .where("schoolCode", "==", schoolCode)
                    .limit(1)
                    .get();
                codeExists = !existing.empty;
                if (codeExists) {
                    schoolCode = generateSchoolCode(name);
                    attempts++;
                }
            }

            const planData = SCHOOL_PLANS[plan] || SCHOOL_PLANS.pro;
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 giorni trial

            // Crea autoscuola
            const schoolRef = db.collection("driving_schools").doc();
            const schoolData = {
                name,
                businessName: businessName || "",
                vatNumber: vatNumber || "",
                email,
                phone: phone || "",
                address: address || "",
                city: city || "",
                province: province || "",
                postalCode: postalCode || "",
                country: "IT",
                schoolCode,
                plan,
                planStatus: "trial",
                trialEndsAt: admin.firestore.Timestamp.fromDate(trialEndDate),
                maxStudents: planData.maxStudents,
                maxInstructors: planData.maxInstructors,
                currentStudents: 0,
                currentInstructors: 1,
                features: planData.features,
                ownerId: userId,
                isActive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            const batch = db.batch();

            // Crea autoscuola
            batch.set(schoolRef, schoolData);

            // Crea istruttore owner
            const instructorRef = schoolRef.collection("school_instructors").doc();
            batch.set(instructorRef, {
                userId,
                name: ownerName,
                email,
                role: "owner",
                permissions: {
                    viewStudents: true,
                    manageStudents: true,
                    viewReports: true,
                    exportData: true,
                    manageInstructors: true,
                    billing: true,
                },
                isActive: true,
                joinedAt: admin.firestore.FieldValue.serverTimestamp(),
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Aggiorna utente con ruolo school_owner
            batch.update(db.collection("users").doc(userId), {
                role: "school_owner",
                schoolId: schoolRef.id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();

            return res.status(201).json({
                success: true,
                schoolId: schoolRef.id,
                schoolCode,
                plan,
                trialEndsAt: trialEndDate.toISOString(),
                message: "Autoscuola registrata con successo! 14 giorni di prova gratuita.",
            });

        } catch (error) {
            console.error("Error registering school:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

// ============================================
// GESTIONE STUDENTI
// ============================================

/**
 * Aggiunge uno studente all'autoscuola
 * POST /addStudent
 */
exports.addStudent = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const decodedToken = await verifyAuth(req);
            const userId = decodedToken.uid;

            const {
                schoolId,
                name,
                email,
                phone,
                assignedInstructorId,
                expectedExamDate,
                sendInvite = true,
            } = req.body;

            if (!schoolId || !name) {
                return res.status(400).json({
                    error: "Missing required fields: schoolId, name"
                });
            }

            // Verifica accesso
            await verifySchoolAccess(userId, schoolId, "admin");

            // Ottieni dati autoscuola
            const schoolDoc = await db.collection("driving_schools").doc(schoolId).get();
            if (!schoolDoc.exists) {
                return res.status(404).json({ error: "School not found" });
            }

            const school = schoolDoc.data();

            // Verifica limite studenti
            if (school.maxStudents !== -1 && school.currentStudents >= school.maxStudents) {
                return res.status(400).json({
                    error: "Student limit reached. Upgrade your plan or add extra students.",
                    currentCount: school.currentStudents,
                    limit: school.maxStudents,
                });
            }

            // Genera codice invito
            const inviteCode = generateInviteCode();

            // Crea studente
            const studentRef = db
                .collection("driving_schools")
                .doc(schoolId)
                .collection("school_students")
                .doc();

            const batch = db.batch();

            batch.set(studentRef, {
                name,
                email: email || "",
                phone: phone || "",
                assignedInstructorId: assignedInstructorId || null,
                enrollmentStatus: "active",
                enrollmentDate: admin.firestore.FieldValue.serverTimestamp(),
                expectedExamDate: expectedExamDate
                    ? admin.firestore.Timestamp.fromDate(new Date(expectedExamDate))
                    : null,
                targetScore: 80,
                isReadyForExam: false,
                flaggedForReview: false,
                inviteCode,
                inviteSentAt: sendInvite
                    ? admin.firestore.FieldValue.serverTimestamp()
                    : null,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Incrementa contatore studenti
            batch.update(db.collection("driving_schools").doc(schoolId), {
                currentStudents: admin.firestore.FieldValue.increment(1),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();

            // TODO: Inviare email/SMS con invito se sendInvite è true

            return res.status(201).json({
                success: true,
                studentId: studentRef.id,
                inviteCode,
                inviteLink: `https://app.patentequiz.com/join/${inviteCode}`,
                message: "Studente aggiunto con successo!",
            });

        } catch (error) {
            console.error("Error adding student:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

/**
 * Studente si unisce all'autoscuola
 * POST /joinSchool
 */
exports.joinSchool = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const decodedToken = await verifyAuth(req);
            const userId = decodedToken.uid;

            const { code } = req.body;

            if (!code) {
                return res.status(400).json({ error: "Missing code" });
            }

            const upperCode = code.trim().toUpperCase();

            // Prima prova con codice autoscuola
            let schoolDoc = null;
            let studentDoc = null;
            let schoolId = null;
            let existingStudentId = null;

            const schoolQuery = await db
                .collection("driving_schools")
                .where("schoolCode", "==", upperCode)
                .where("isActive", "==", true)
                .limit(1)
                .get();

            if (!schoolQuery.empty) {
                schoolDoc = schoolQuery.docs[0];
                schoolId = schoolDoc.id;
            } else {
                // Prova con codice invito studente
                const studentQuery = await db
                    .collectionGroup("school_students")
                    .where("inviteCode", "==", upperCode)
                    .limit(1)
                    .get();

                if (studentQuery.empty) {
                    return res.status(404).json({
                        error: "Invalid code. Please check with your driving school."
                    });
                }

                studentDoc = studentQuery.docs[0];
                schoolId = studentDoc.ref.parent.parent.id;
                existingStudentId = studentDoc.id;

                schoolDoc = await db.collection("driving_schools").doc(schoolId).get();
            }

            if (!schoolDoc.exists) {
                return res.status(404).json({ error: "School not found" });
            }

            const school = schoolDoc.data();

            // Verifica piano attivo
            if (school.planStatus === "expired" || school.planStatus === "cancelled") {
                return res.status(400).json({
                    error: "This school's subscription is not active"
                });
            }

            // Verifica se utente già iscritto
            const userDoc = await db.collection("users").doc(userId).get();
            if (userDoc.exists && userDoc.data().schoolId === schoolId) {
                return res.status(400).json({
                    error: "You are already enrolled in this school"
                });
            }

            const batch = db.batch();
            let newStudentId = existingStudentId;

            if (existingStudentId) {
                // Aggiorna studente esistente
                batch.update(
                    db.collection("driving_schools")
                        .doc(schoolId)
                        .collection("school_students")
                        .doc(existingStudentId),
                    {
                        userId,
                        inviteAcceptedAt: admin.firestore.FieldValue.serverTimestamp(),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    }
                );
            } else {
                // Verifica limite studenti
                if (school.maxStudents !== -1 && school.currentStudents >= school.maxStudents) {
                    return res.status(400).json({
                        error: "This school has reached its student limit"
                    });
                }

                // Crea nuovo studente
                const studentRef = db
                    .collection("driving_schools")
                    .doc(schoolId)
                    .collection("school_students")
                    .doc();

                newStudentId = studentRef.id;

                // Ottieni info utente
                const authUser = await admin.auth().getUser(userId);

                batch.set(studentRef, {
                    userId,
                    name: authUser.displayName || "Studente",
                    email: authUser.email || "",
                    enrollmentStatus: "active",
                    enrollmentDate: admin.firestore.FieldValue.serverTimestamp(),
                    targetScore: 80,
                    isReadyForExam: false,
                    flaggedForReview: false,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                // Incrementa contatore
                batch.update(db.collection("driving_schools").doc(schoolId), {
                    currentStudents: admin.firestore.FieldValue.increment(1),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            }

            // Aggiorna utente con Premium e collegamento scuola
            batch.update(db.collection("users").doc(userId), {
                schoolId,
                schoolStudentId: newStudentId,
                enrolledViaSchool: true,
                isPremium: true,
                premiumSource: "school",
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();

            return res.status(200).json({
                success: true,
                schoolId,
                schoolName: school.name,
                logoUrl: school.logoUrl || null,
                primaryColor: school.primaryColor || "#4F46E5",
                message: "Successfully enrolled! You now have free Premium access.",
            });

        } catch (error) {
            console.error("Error joining school:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

// ============================================
// DASHBOARD E REPORTS
// ============================================

/**
 * Ottiene statistiche dashboard autoscuola
 * GET /schoolDashboard?schoolId=xxx
 */
exports.schoolDashboard = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const decodedToken = await verifyAuth(req);
            const userId = decodedToken.uid;
            const { schoolId } = req.query;

            if (!schoolId) {
                return res.status(400).json({ error: "Missing schoolId" });
            }

            // Verifica accesso
            await verifySchoolAccess(userId, schoolId, "instructor");

            // Ottieni dati autoscuola
            const schoolDoc = await db.collection("driving_schools").doc(schoolId).get();
            if (!schoolDoc.exists) {
                return res.status(404).json({ error: "School not found" });
            }

            const school = schoolDoc.data();

            // Ottieni studenti
            const studentsQuery = await db
                .collection("driving_schools")
                .doc(schoolId)
                .collection("school_students")
                .where("enrollmentStatus", "in", ["active", "completed"])
                .get();

            const students = studentsQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Calcola statistiche
            const activeStudents = students.filter(s => s.enrollmentStatus === "active").length;
            const readyForExam = students.filter(s => s.isReadyForExam).length;
            const completedThisMonth = students.filter(s => {
                if (s.actualExamDate && s.examPassed) {
                    const examDate = s.actualExamDate.toDate();
                    const now = new Date();
                    return examDate.getMonth() === now.getMonth() &&
                        examDate.getFullYear() === now.getFullYear();
                }
                return false;
            }).length;

            // Studenti che richiedono attenzione (inattivi da 7+ giorni)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const studentsNeedingAttention = students
                .filter(s => {
                    if (s.lastActivity) {
                        return s.lastActivity.toDate() < oneWeekAgo;
                    }
                    return true;
                })
                .slice(0, 5)
                .map(s => ({
                    id: s.id,
                    name: s.name,
                    reason: "Inattivo da più di 7 giorni",
                }));

            // Studenti pronti per esame
            const readyStudents = students
                .filter(s => s.isReadyForExam)
                .slice(0, 5)
                .map(s => ({
                    id: s.id,
                    name: s.name,
                    averageScore: s.averageScore || 0,
                }));

            return res.status(200).json({
                school: {
                    id: schoolId,
                    name: school.name,
                    schoolCode: school.schoolCode,
                    plan: school.plan,
                    planStatus: school.planStatus,
                    trialEndsAt: school.trialEndsAt?.toDate().toISOString(),
                },
                stats: {
                    totalStudents: students.length,
                    activeStudents,
                    readyForExam,
                    completedThisMonth,
                },
                planUsage: {
                    studentsUsed: school.currentStudents,
                    studentsLimit: school.maxStudents,
                    instructorsUsed: school.currentInstructors,
                    instructorsLimit: school.maxInstructors,
                },
                studentsNeedingAttention,
                readyStudents,
            });

        } catch (error) {
            console.error("Error getting dashboard:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

// ============================================
// GESTIONE ABBONAMENTO
// ============================================

/**
 * Crea checkout session per abbonamento autoscuola
 * POST /createSchoolCheckout
 */
exports.createSchoolCheckout = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const decodedToken = await verifyAuth(req);
            const userId = decodedToken.uid;

            const { schoolId, plan, billingCycle } = req.body;

            if (!schoolId || !plan || !billingCycle) {
                return res.status(400).json({
                    error: "Missing required fields: schoolId, plan, billingCycle"
                });
            }

            // Verifica che l'utente sia owner
            await verifySchoolAccess(userId, schoolId, "owner");

            const schoolDoc = await db.collection("driving_schools").doc(schoolId).get();
            if (!schoolDoc.exists) {
                return res.status(404).json({ error: "School not found" });
            }

            const school = schoolDoc.data();
            const planData = SCHOOL_PLANS[plan];

            if (!planData) {
                return res.status(400).json({ error: "Invalid plan" });
            }

            const price = billingCycle === "monthly"
                ? planData.monthlyPrice * 100 // Stripe usa centesimi
                : planData.yearlyPrice * 100;

            // Crea o recupera customer Stripe
            let customerId = school.stripeCustomerId;
            if (!customerId) {
                const customer = await stripe.customers.create({
                    email: school.email,
                    metadata: {
                        schoolId,
                        firebaseUserId: userId,
                    },
                });
                customerId = customer.id;

                await db.collection("driving_schools").doc(schoolId).update({
                    stripeCustomerId: customerId,
                });
            }

            // Crea sessione checkout
            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                payment_method_types: ["card"],
                mode: "subscription",
                line_items: [{
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Patente Quiz Business - ${planData.name}`,
                            description: `Piano ${planData.name} (${billingCycle === "monthly" ? "mensile" : "annuale"})`,
                        },
                        unit_amount: price,
                        recurring: {
                            interval: billingCycle === "monthly" ? "month" : "year",
                        },
                    },
                    quantity: 1,
                }],
                metadata: {
                    schoolId,
                    plan,
                    billingCycle,
                    type: "school_subscription",
                },
                success_url: `${req.headers.origin || "https://business.patentequiz.com"}/settings/billing?success=true`,
                cancel_url: `${req.headers.origin || "https://business.patentequiz.com"}/settings/billing?canceled=true`,
            });

            return res.status(200).json({
                sessionId: session.id,
                url: session.url,
            });

        } catch (error) {
            console.error("Error creating checkout:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

/**
 * Webhook per eventi Stripe autoscuole
 * POST /schoolStripeWebhook
 */
exports.schoolStripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = functions.config().stripe?.school_webhook_secret;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                if (session.metadata?.type === "school_subscription") {
                    const { schoolId, plan, billingCycle } = session.metadata;
                    const planData = SCHOOL_PLANS[plan];

                    await db.collection("driving_schools").doc(schoolId).update({
                        plan,
                        planStatus: "active",
                        maxStudents: planData.maxStudents,
                        maxInstructors: planData.maxInstructors,
                        features: planData.features,
                        stripeSubscriptionId: session.subscription,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });

                    // Crea record subscription
                    await db.collection("school_subscriptions").add({
                        schoolId,
                        plan,
                        billingCycle,
                        amount: session.amount_total / 100,
                        currency: "EUR",
                        status: "active",
                        stripeSubscriptionId: session.subscription,
                        stripeCustomerId: session.customer,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                }
                break;
            }

            case "invoice.paid": {
                const invoice = event.data.object;
                if (invoice.metadata?.schoolId) {
                    const { schoolId } = invoice.metadata;

                    // Crea fattura
                    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

                    await db.collection("school_invoices").add({
                        schoolId,
                        invoiceNumber,
                        amount: invoice.subtotal / 100,
                        taxAmount: invoice.tax ? invoice.tax / 100 : 0,
                        totalAmount: invoice.total / 100,
                        currency: "EUR",
                        status: "paid",
                        issuedAt: admin.firestore.FieldValue.serverTimestamp(),
                        paidAt: admin.firestore.FieldValue.serverTimestamp(),
                        stripeInvoiceId: invoice.id,
                        pdfUrl: invoice.invoice_pdf,
                    });
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;

                const schoolQuery = await db
                    .collection("driving_schools")
                    .where("stripeSubscriptionId", "==", subscription.id)
                    .limit(1)
                    .get();

                if (!schoolQuery.empty) {
                    const schoolId = schoolQuery.docs[0].id;

                    await db.collection("driving_schools").doc(schoolId).update({
                        planStatus: "cancelled",
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });

                    // Rimuovi premium dagli studenti
                    // TODO: Implementare batch update per tutti gli studenti
                }
                break;
            }
        }

        return res.status(200).json({ received: true });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(500).json({ error: error.message });
    }
});

// ============================================
// MESSAGGI
// ============================================

/**
 * Invia messaggio a studenti
 * POST /sendSchoolMessage
 */
exports.sendSchoolMessage = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const decodedToken = await verifyAuth(req);
            const userId = decodedToken.uid;

            const {
                schoolId,
                recipientType, // 'all_students', 'student', 'group'
                recipientId,
                subject,
                message,
                messageType = 'info', // 'info', 'reminder', 'alert', 'congratulation'
            } = req.body;

            if (!schoolId || !message) {
                return res.status(400).json({
                    error: "Missing required fields: schoolId, message"
                });
            }

            // Verifica accesso
            const { instructor } = await verifySchoolAccess(userId, schoolId, "instructor");

            // Crea messaggio
            const messageRef = await db.collection("school_messages").add({
                schoolId,
                senderType: "instructor",
                senderId: userId,
                senderName: instructor.name,
                recipientType,
                recipientId: recipientId || null,
                subject: subject || "",
                message,
                messageType,
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // TODO: Inviare push notification agli studenti

            return res.status(201).json({
                success: true,
                messageId: messageRef.id,
                message: "Messaggio inviato con successo!",
            });

        } catch (error) {
            console.error("Error sending message:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

// ============================================
// TRIGGER: AGGIORNA STATISTICHE STUDENTE
// ============================================

/**
 * Quando uno studente completa un quiz, aggiorna le sue statistiche nell'autoscuola
 */
exports.onQuizCompleted = functions.firestore
    .document("users/{userId}/quiz_results/{quizId}")
    .onCreate(async (snap, context) => {
        const { userId } = context.params;
        const quizResult = snap.data();

        try {
            // Verifica se lo studente è iscritto a un'autoscuola
            const userDoc = await db.collection("users").doc(userId).get();
            if (!userDoc.exists || !userDoc.data().schoolId) {
                return null;
            }

            const { schoolId, schoolStudentId } = userDoc.data();

            // Aggiorna statistiche studente
            const studentRef = db
                .collection("driving_schools")
                .doc(schoolId)
                .collection("school_students")
                .doc(schoolStudentId);

            await studentRef.update({
                lastActivity: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Log attività per report
            await db.collection("school_student_activity").add({
                schoolId,
                studentId: schoolStudentId,
                userId,
                activityType: quizResult.isSimulation ? "simulation_completed" : "quiz_completed",
                details: {
                    score: quizResult.score,
                    totalQuestions: quizResult.totalQuestions,
                    passed: quizResult.score >= 36, // Min per patente B
                },
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            return null;

        } catch (error) {
            console.error("Error updating student stats:", error);
            return null;
        }
    });
