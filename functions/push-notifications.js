/**
 * Servizio Push Notifications per B2B Autoscuole
 * Usa Firebase Cloud Messaging (FCM)
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inizializza se non già inizializzato
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Invia notifica push a un singolo utente
 */
async function sendPushToUser(userId, notification, data = {}) {
    try {
        // Ottieni FCM token dell'utente
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            console.log(`User ${userId} not found`);
            return null;
        }

        const fcmToken = userDoc.data().fcmToken;
        if (!fcmToken) {
            console.log(`User ${userId} has no FCM token`);
            return null;
        }

        const message = {
            token: fcmToken,
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: {
                ...data,
                click_action: "FLUTTER_NOTIFICATION_CLICK",
            },
            android: {
                priority: "high",
                notification: {
                    sound: "default",
                    channelId: "school_messages",
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: "default",
                        badge: 1,
                    },
                },
            },
        };

        const response = await messaging.send(message);
        console.log(`✅ Push sent to ${userId}: ${response}`);
        return response;

    } catch (error) {
        console.error(`❌ Error sending push to ${userId}:`, error);
        // Se il token è invalido, rimuovilo
        if (error.code === "messaging/registration-token-not-registered") {
            await db.collection("users").doc(userId).update({
                fcmToken: admin.firestore.FieldValue.delete(),
            });
        }
        throw error;
    }
}

/**
 * Invia notifica push a più utenti
 */
async function sendPushToUsers(userIds, notification, data = {}) {
    const results = {
        success: 0,
        failed: 0,
        errors: [],
    };

    for (const userId of userIds) {
        try {
            await sendPushToUser(userId, notification, data);
            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({ userId, error: error.message });
        }
    }

    return results;
}

/**
 * Invia messaggio dall'autoscuola allo studente
 */
async function sendSchoolMessageNotification(data) {
    const {
        studentUserId,
        schoolName,
        instructorName,
        subject,
        messagePreview,
        messageType, // info, reminder, alert, congratulation
        messageId,
    } = data;

    const typeEmojis = {
        info: "ℹ️",
        reminder: "⏰",
        alert: "⚠️",
        congratulation: "🎉",
    };

    const emoji = typeEmojis[messageType] || "📨";

    return sendPushToUser(studentUserId, {
        title: `${emoji} ${schoolName}`,
        body: `${instructorName}: ${subject}`,
    }, {
        type: "school_message",
        messageId,
        schoolName,
        instructorName,
    });
}

/**
 * Notifica che studente è pronto per esame (a istruttore)
 */
async function notifyStudentReady(data) {
    const {
        instructorUserId,
        studentName,
        averageScore,
        schoolName,
    } = data;

    return sendPushToUser(instructorUserId, {
        title: `🎓 ${studentName} è pronto!`,
        body: `Media ${averageScore}% - Pronto per l'esame teorico`,
    }, {
        type: "student_ready",
        studentName,
    });
}

/**
 * Notifica studente inattivo (a istruttore)
 */
async function notifyInactiveStudent(data) {
    const {
        instructorUserId,
        studentName,
        daysSinceActivity,
        schoolName,
    } = data;

    return sendPushToUser(instructorUserId, {
        title: `⏰ Studente inattivo`,
        body: `${studentName} non studia da ${daysSinceActivity} giorni`,
    }, {
        type: "student_inactive",
        studentName,
        daysSinceActivity: String(daysSinceActivity),
    });
}

/**
 * Notifica nuovo studente iscritto (a owner/admin)
 */
async function notifyNewStudent(data) {
    const {
        ownerUserId,
        studentName,
        schoolName,
    } = data;

    return sendPushToUser(ownerUserId, {
        title: `👋 Nuovo studente!`,
        body: `${studentName} si è iscritto a ${schoolName}`,
    }, {
        type: "new_student",
        studentName,
    });
}

/**
 * Promemoria studio (a studente)
 */
async function sendStudyReminder(data) {
    const {
        studentUserId,
        schoolName,
        daysSinceActivity,
    } = data;

    return sendPushToUser(studentUserId, {
        title: `📚 È ora di studiare!`,
        body: `La tua autoscuola ti aspetta. Riprendi da dove avevi lasciato.`,
    }, {
        type: "study_reminder",
        schoolName,
    });
}

/**
 * Congratulazioni per traguardo (a studente)
 */
async function sendMilestoneNotification(data) {
    const {
        studentUserId,
        milestoneType, // first_quiz, 10_quizzes, first_simulation_passed, etc.
        milestoneValue,
        schoolName,
    } = data;

    const milestones = {
        first_quiz: { title: "🎯 Primo quiz completato!", body: "Ottimo inizio! Continua così." },
        "10_quizzes": { title: "🔥 10 quiz completati!", body: "Stai andando alla grande!" },
        "50_quizzes": { title: "⭐ 50 quiz completati!", body: "Sei un campione!" },
        first_simulation_passed: { title: "🏆 Prima simulazione superata!", body: "Fantastico risultato!" },
        ready_for_exam: { title: "🎓 Sei pronto per l'esame!", body: "I tuoi risultati sono eccellenti." },
    };

    const milestone = milestones[milestoneType] || {
        title: "🎉 Nuovo traguardo!",
        body: `Hai raggiunto un nuovo obiettivo!`,
    };

    return sendPushToUser(studentUserId, milestone, {
        type: "milestone",
        milestoneType,
        milestoneValue: String(milestoneValue || ""),
    });
}

/**
 * Cloud Function: Trigger quando viene creato un messaggio scuola
 */
exports.onSchoolMessageCreated = functions.firestore
    .document("school_messages/{messageId}")
    .onCreate(async (snap, context) => {
        const message = snap.data();
        const messageId = context.params.messageId;

        try {
            // Se è per tutti gli studenti
            if (message.recipientType === "all_students") {
                const studentsQuery = await db
                    .collection("driving_schools")
                    .doc(message.schoolId)
                    .collection("school_students")
                    .where("enrollmentStatus", "==", "active")
                    .get();

                const userIds = studentsQuery.docs
                    .map(doc => doc.data().userId)
                    .filter(id => id);

                await sendPushToUsers(userIds, {
                    title: `📨 ${message.senderName || "Autoscuola"}`,
                    body: message.subject || message.message.substring(0, 100),
                }, {
                    type: "school_message",
                    messageId,
                });

            } else if (message.recipientType === "student" && message.recipientId) {
                // Singolo studente
                const studentDoc = await db
                    .collection("driving_schools")
                    .doc(message.schoolId)
                    .collection("school_students")
                    .doc(message.recipientId)
                    .get();

                if (studentDoc.exists && studentDoc.data().userId) {
                    await sendSchoolMessageNotification({
                        studentUserId: studentDoc.data().userId,
                        schoolName: message.schoolName || "Autoscuola",
                        instructorName: message.senderName || "Istruttore",
                        subject: message.subject || "Nuovo messaggio",
                        messagePreview: message.message.substring(0, 100),
                        messageType: message.messageType || "info",
                        messageId,
                    });
                }
            }

            console.log(`✅ Notifications sent for message ${messageId}`);

        } catch (error) {
            console.error(`❌ Error sending notifications for message ${messageId}:`, error);
        }
    });

/**
 * Cloud Function: Scheduled job per promemoria studenti inattivi
 * Esegue ogni giorno alle 10:00
 */
exports.sendInactiveStudentReminders = functions.pubsub
    .schedule("0 10 * * *")
    .timeZone("Europe/Rome")
    .onRun(async (context) => {
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // Trova autoscuole attive
            const schoolsQuery = await db
                .collection("driving_schools")
                .where("isActive", "==", true)
                .where("planStatus", "in", ["trial", "active"])
                .get();

            for (const schoolDoc of schoolsQuery.docs) {
                const school = schoolDoc.data();

                // Trova studenti inattivi
                const studentsQuery = await db
                    .collection("driving_schools")
                    .doc(schoolDoc.id)
                    .collection("school_students")
                    .where("enrollmentStatus", "==", "active")
                    .get();

                for (const studentDoc of studentsQuery.docs) {
                    const student = studentDoc.data();

                    if (!student.userId || !student.lastActivity) continue;

                    const lastActivity = student.lastActivity.toDate();
                    if (lastActivity < sevenDaysAgo) {
                        const daysSince = Math.floor(
                            (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
                        );

                        await sendStudyReminder({
                            studentUserId: student.userId,
                            schoolName: school.name,
                            daysSinceActivity: daysSince,
                        });
                    }
                }
            }

            console.log("✅ Inactive student reminders sent");

        } catch (error) {
            console.error("❌ Error sending inactive reminders:", error);
        }
    });

module.exports = {
    sendPushToUser,
    sendPushToUsers,
    sendSchoolMessageNotification,
    notifyStudentReady,
    notifyInactiveStudent,
    notifyNewStudent,
    sendStudyReminder,
    sendMilestoneNotification,
    onSchoolMessageCreated: exports.onSchoolMessageCreated,
    sendInactiveStudentReminders: exports.sendInactiveStudentReminders,
};
