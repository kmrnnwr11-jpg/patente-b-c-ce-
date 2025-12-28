/**
 * Servizio email per B2B Autoscuole
 * Supporta SendGrid e Mailgun
 */

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const templates = require("./email-templates");

// Configurazione (scegli un provider)
const EMAIL_PROVIDER = functions.config().email?.provider || "sendgrid"; // "sendgrid" o "mailgun"

// SendGrid setup
const SENDGRID_API_KEY = functions.config().sendgrid?.api_key;

// Mailgun setup (alternativa)
const MAILGUN_API_KEY = functions.config().mailgun?.api_key;
const MAILGUN_DOMAIN = functions.config().mailgun?.domain;

// Transporter per Nodemailer
let transporter = null;

function getTransporter() {
    if (transporter) return transporter;

    if (EMAIL_PROVIDER === "sendgrid" && SENDGRID_API_KEY) {
        // Usa SendGrid via SMTP
        transporter = nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 587,
            auth: {
                user: "apikey",
                pass: SENDGRID_API_KEY,
            },
        });
    } else if (EMAIL_PROVIDER === "mailgun" && MAILGUN_API_KEY) {
        // Usa Mailgun
        const mailgun = require("nodemailer-mailgun-transport");
        transporter = nodemailer.createTransport(mailgun({
            auth: {
                api_key: MAILGUN_API_KEY,
                domain: MAILGUN_DOMAIN,
            },
        }));
    } else {
        // Fallback: log only (development)
        console.log("⚠️ No email provider configured. Emails will be logged only.");
        return null;
    }

    return transporter;
}

/**
 * Invia una email
 */
async function sendEmail({ to, subject, html, from = "Patente Quiz Business <noreply@patentequiz.com>" }) {
    const transport = getTransporter();

    const mailOptions = {
        from,
        to,
        subject,
        html,
    };

    if (!transport) {
        // Development: log
        console.log("📧 EMAIL (dev mode):", {
            to,
            subject,
            htmlPreview: html.substring(0, 200) + "...",
        });
        return { success: true, mode: "development" };
    }

    try {
        const result = await transport.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${result.messageId}`);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error);
        throw error;
    }
}

/**
 * Invia invito studente
 */
async function sendStudentInvite(data) {
    const html = templates.studentInviteTemplate(data);
    return sendEmail({
        to: data.studentEmail,
        subject: `🚗 ${data.schoolName} ti invita a studiare con Patente Quiz`,
        html,
    });
}

/**
 * Invia conferma iscrizione studente
 */
async function sendEnrollmentConfirmation(data) {
    const html = templates.studentEnrollmentConfirmTemplate(data);
    return sendEmail({
        to: data.studentEmail,
        subject: `✅ Benvenuto in ${data.schoolName}!`,
        html,
    });
}

/**
 * Invia conferma registrazione autoscuola
 */
async function sendSchoolRegistrationConfirmation(data) {
    const html = templates.schoolRegistrationTemplate(data);
    return sendEmail({
        to: data.ownerEmail,
        subject: `🎉 ${data.schoolName} è stata registrata!`,
        html,
    });
}

/**
 * Notifica che studente è pronto per esame
 */
async function sendStudentReadyNotification(data) {
    const html = templates.studentReadyForExamTemplate(data);
    return sendEmail({
        to: data.instructorEmail,
        subject: `🎓 ${data.studentName} è pronto per l'esame!`,
        html,
    });
}

/**
 * Promemoria studente inattivo
 */
async function sendInactiveStudentReminder(data) {
    const html = templates.inactiveStudentReminderTemplate(data);
    return sendEmail({
        to: data.studentEmail,
        subject: `⏰ ${data.studentName}, ti aspettiamo!`,
        html,
    });
}

/**
 * Avviso scadenza abbonamento
 */
async function sendSubscriptionExpiringNotification(data) {
    const html = templates.subscriptionExpiringTemplate(data);
    return sendEmail({
        to: data.ownerEmail,
        subject: `⚠️ Il tuo abbonamento ${data.schoolName} sta per scadere`,
        html,
    });
}

/**
 * Messaggio dall'istruttore
 */
async function sendInstructorMessage(data) {
    const html = templates.instructorMessageTemplate(data);
    return sendEmail({
        to: data.studentEmail,
        subject: `📨 Messaggio da ${data.instructorName}: ${data.subject}`,
        html,
    });
}

module.exports = {
    sendEmail,
    sendStudentInvite,
    sendEnrollmentConfirmation,
    sendSchoolRegistrationConfirmation,
    sendStudentReadyNotification,
    sendInactiveStudentReminder,
    sendSubscriptionExpiringNotification,
    sendInstructorMessage,
};
