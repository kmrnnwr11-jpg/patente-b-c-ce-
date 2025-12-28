/**
 * Email Templates per Sistema B2B Autoscuole
 * Utilizzati con servizi come SendGrid, Mailgun, o Firebase Extensions
 */

// Template base HTML
const baseTemplate = (content, schoolName = 'Patente Quiz Business') => `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Patente Quiz</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; background: #4F46E5; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .button:hover { background: #4338CA; }
    .code-box { background: #F3F4F6; border: 2px dashed #D1D5DB; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .code { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 4px; font-family: monospace; }
    .footer { background: #1F2937; padding: 30px; text-align: center; color: #9CA3AF; font-size: 14px; }
    .footer a { color: #818CF8; text-decoration: none; }
    .info-box { background: #EEF2FF; border-left: 4px solid #4F46E5; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .success-box { background: #ECFDF5; border-left: 4px solid #10B981; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .warning-box { background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    h2 { color: #1F2937; }
    p { color: #4B5563; line-height: 1.6; }
    .steps { background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .step { display: flex; align-items: flex-start; margin: 16px 0; }
    .step-number { background: #4F46E5; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 16px; flex-shrink: 0; }
    .logo { height: 50px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 Patente Quiz</h1>
      <p>${schoolName}</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© 2024 Patente Quiz Business. Tutti i diritti riservati.</p>
      <p><a href="https://business.patentequiz.com">business.patentequiz.com</a></p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email: Invito studente dall'autoscuola
 */
const studentInviteTemplate = (data) => {
    const {
        studentName,
        schoolName,
        schoolLogo,
        inviteCode,
        inviteLink,
        instructorName,
        schoolPhone,
    } = data;

    const content = `
    <h2>Ciao ${studentName}! 👋</h2>
    
    <p>Sei stato invitato a studiare con <strong>${schoolName}</strong> utilizzando l'app Patente Quiz.</p>
    
    <div class="success-box">
      <strong>🎉 Ottima notizia!</strong><br>
      Hai accesso <strong>Premium GRATUITO</strong> offerto dalla tua autoscuola!
    </div>
    
    <p>Con l'app potrai:</p>
    <ul style="color: #4B5563;">
      <li>📚 Studiare la teoria con spiegazioni dettagliate</li>
      <li>📝 Esercitarti con migliaia di quiz ministeriali</li>
      <li>🎯 Fare simulazioni d'esame realistiche</li>
      <li>📊 Monitorare i tuoi progressi</li>
    </ul>
    
    <div class="code-box">
      <p style="margin: 0 0 10px; color: #6B7280;">Il tuo codice di accesso</p>
      <div class="code">${inviteCode}</div>
    </div>
    
    <div class="steps">
      <h3 style="margin-top: 0;">Come iniziare:</h3>
      <div class="step">
        <div class="step-number">1</div>
        <div>Scarica l'app <strong>Patente Quiz</strong> da App Store o Google Play</div>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <div>Clicca su <strong>"Hai un codice autoscuola?"</strong></div>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <div>Inserisci il codice <strong>${inviteCode}</strong></div>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        <div>Inizia a studiare! 🚀</div>
      </div>
    </div>
    
    <p style="text-align: center;">
      <a href="${inviteLink}" class="button">Apri l'App</a>
    </p>
    
    ${instructorName ? `
    <div class="info-box">
      <strong>Il tuo istruttore:</strong> ${instructorName}<br>
      ${schoolPhone ? `<strong>Contatto:</strong> ${schoolPhone}` : ''}
    </div>
    ` : ''}
    
    <p>In bocca al lupo per il tuo esame! 🍀</p>
    
    <p>
      Cordiali saluti,<br>
      <strong>Il team di ${schoolName}</strong>
    </p>
  `;

    return baseTemplate(content, schoolName);
};

/**
 * Email: Conferma iscrizione studente
 */
const studentEnrollmentConfirmTemplate = (data) => {
    const { studentName, schoolName, schoolCode } = data;

    const content = `
    <h2>Benvenuto, ${studentName}! 🎉</h2>
    
    <p>La tua iscrizione a <strong>${schoolName}</strong> è stata confermata con successo!</p>
    
    <div class="success-box">
      <strong>✅ Accesso Premium attivato!</strong><br>
      Hai accesso a tutte le funzionalità Premium gratuitamente.
    </div>
    
    <p>Cosa puoi fare ora:</p>
    <ul style="color: #4B5563;">
      <li>📖 Studia le lezioni di teoria</li>
      <li>✏️ Esercitati con i quiz</li>
      <li>🏆 Fai simulazioni d'esame</li>
      <li>📈 Monitora i tuoi progressi</li>
    </ul>
    
    <p>I tuoi progressi saranno visibili anche al tuo istruttore, che potrà aiutarti nelle aree più difficili.</p>
    
    <p style="text-align: center;">
      <a href="https://app.patentequiz.com" class="button">Inizia a Studiare</a>
    </p>
    
    <div class="info-box">
      <strong>Codice Autoscuola:</strong> ${schoolCode}<br>
      <small>Conservalo per riferimento futuro</small>
    </div>
    
    <p>Buono studio!</p>
  `;

    return baseTemplate(content, schoolName);
};

/**
 * Email: Registrazione autoscuola completata
 */
const schoolRegistrationTemplate = (data) => {
    const { ownerName, schoolName, schoolCode, trialEndDate, plan } = data;

    const content = `
    <h2>Benvenuto, ${ownerName}! 🚗</h2>
    
    <p>La registrazione di <strong>${schoolName}</strong> è stata completata con successo!</p>
    
    <div class="success-box">
      <strong>🎁 14 giorni di prova gratuita attivati!</strong><br>
      Hai tempo fino al ${trialEndDate} per provare tutte le funzionalità.
    </div>
    
    <div class="code-box">
      <p style="margin: 0 0 10px; color: #6B7280;">Il codice della tua autoscuola</p>
      <div class="code">${schoolCode}</div>
      <p style="margin: 10px 0 0; color: #6B7280; font-size: 14px;">
        Condividilo con i tuoi studenti per iscriverli
      </p>
    </div>
    
    <h3>Prossimi passi:</h3>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <div><strong>Personalizza</strong> - Carica il logo della tua autoscuola</div>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <div><strong>Invita istruttori</strong> - Aggiungi il tuo team</div>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <div><strong>Aggiungi studenti</strong> - Inizia a monitorare i progressi</div>
      </div>
    </div>
    
    <p style="text-align: center;">
      <a href="https://business.patentequiz.com/dashboard" class="button">Vai alla Dashboard</a>
    </p>
    
    <div class="info-box">
      <strong>Il tuo piano:</strong> ${plan}<br>
      <strong>Trial termina:</strong> ${trialEndDate}
    </div>
    
    <p>Hai domande? Rispondi a questa email o visita il nostro <a href="https://business.patentequiz.com/help">Centro Assistenza</a>.</p>
  `;

    return baseTemplate(content);
};

/**
 * Email: Studente pronto per l'esame
 */
const studentReadyForExamTemplate = (data) => {
    const { studentName, schoolName, averageScore, simulationsPassed } = data;

    const content = `
    <h2>🎉 Grande notizia!</h2>
    
    <p>Lo studente <strong>${studentName}</strong> è pronto per l'esame!</p>
    
    <div class="success-box">
      <strong>Statistiche:</strong><br>
      📊 Media punteggio: <strong>${averageScore}%</strong><br>
      ✅ Simulazioni superate: <strong>${simulationsPassed}</strong>
    </div>
    
    <p>È il momento di prenotare l'esame teorico!</p>
    
    <p style="text-align: center;">
      <a href="https://business.patentequiz.com/students" class="button">Vedi Dettagli</a>
    </p>
  `;

    return baseTemplate(content, schoolName);
};

/**
 * Email: Promemoria studente inattivo
 */
const inactiveStudentReminderTemplate = (data) => {
    const { studentName, schoolName, daysSinceActivity, instructorName } = data;

    const content = `
    <h2>Ci manchi, ${studentName}! 📚</h2>
    
    <p>Sono passati <strong>${daysSinceActivity} giorni</strong> dal tuo ultimo accesso all'app.</p>
    
    <div class="warning-box">
      <strong>⏰ Ricorda:</strong> La pratica costante è la chiave del successo all'esame!
    </div>
    
    <p>Bastano anche solo <strong>15 minuti al giorno</strong> per fare la differenza.</p>
    
    <p style="text-align: center;">
      <a href="https://app.patentequiz.com" class="button">Riprendi a Studiare</a>
    </p>
    
    ${instructorName ? `
    <p style="color: #6B7280; font-style: italic;">
      Messaggio inviato da ${instructorName} di ${schoolName}
    </p>
    ` : ''}
  `;

    return baseTemplate(content, schoolName);
};

/**
 * Email: Abbonamento scaduto / scadenza imminente
 */
const subscriptionExpiringTemplate = (data) => {
    const { ownerName, schoolName, expirationDate, plan, studentsCount } = data;

    const content = `
    <h2>Il tuo abbonamento sta per scadere ⏰</h2>
    
    <p>Ciao ${ownerName},</p>
    
    <p>L'abbonamento di <strong>${schoolName}</strong> scadrà il <strong>${expirationDate}</strong>.</p>
    
    <div class="warning-box">
      <strong>⚠️ Attenzione:</strong><br>
      I tuoi ${studentsCount} studenti perderanno l'accesso Premium se non rinnovi.
    </div>
    
    <p>Per continuare a offrire il servizio ai tuoi studenti, rinnova il tuo piano ${plan}.</p>
    
    <p style="text-align: center;">
      <a href="https://business.patentequiz.com/settings/billing" class="button">Rinnova Ora</a>
    </p>
    
    <p>Hai domande? <a href="mailto:support@patentequiz.com">Contattaci</a></p>
  `;

    return baseTemplate(content);
};

/**
 * Email: Messaggio dall'istruttore
 */
const instructorMessageTemplate = (data) => {
    const { studentName, schoolName, instructorName, subject, message, messageType } = data;

    const typeStyles = {
        info: { icon: 'ℹ️', bg: '#EEF2FF', border: '#4F46E5' },
        reminder: { icon: '⏰', bg: '#FFFBEB', border: '#F59E0B' },
        alert: { icon: '⚠️', bg: '#FEF2F2', border: '#EF4444' },
        congratulation: { icon: '🎉', bg: '#ECFDF5', border: '#10B981' },
    };

    const style = typeStyles[messageType] || typeStyles.info;

    const content = `
    <h2>${style.icon} ${subject}</h2>
    
    <p>Ciao ${studentName},</p>
    
    <div style="background: ${style.bg}; border-left: 4px solid ${style.border}; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      ${message}
    </div>
    
    <p style="color: #6B7280;">
      Messaggio da <strong>${instructorName}</strong><br>
      ${schoolName}
    </p>
    
    <p style="text-align: center;">
      <a href="https://app.patentequiz.com" class="button">Apri l'App</a>
    </p>
  `;

    return baseTemplate(content, schoolName);
};

module.exports = {
    baseTemplate,
    studentInviteTemplate,
    studentEnrollmentConfirmTemplate,
    schoolRegistrationTemplate,
    studentReadyForExamTemplate,
    inactiveStudentReminderTemplate,
    subscriptionExpiringTemplate,
    instructorMessageTemplate,
};
