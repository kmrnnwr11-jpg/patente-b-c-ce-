# Schema Database Firestore - Sistema B2B Autoscuole

## Collezioni Principali

### 📚 `driving_schools`
Contiene tutte le autoscuole registrate.

```javascript
{
  // Info Base
  name: string,                    // "Autoscuola Roma Centro"
  businessName: string,            // "Autoscuola Roma Centro SRL"
  vatNumber: string,               // "IT12345678901"
  email: string,                   // "info@autoscuola.it"
  phone: string,                   // "+39 06 1234567"
  
  // Indirizzo
  address: string,                 // "Via Roma 123"
  city: string,                    // "Roma"
  province: string,                // "RM"
  postalCode: string,              // "00100"
  country: string,                 // "IT"
  
  // Codici
  schoolCode: string,              // "AUTO-A1B2C3" - univoco
  
  // Piano e Abbonamento
  plan: "starter" | "pro" | "enterprise",
  planStatus: "trial" | "active" | "expired" | "cancelled",
  trialEndsAt: Timestamp | null,
  maxStudents: number,             // -1 = illimitati
  maxInstructors: number,          // -1 = illimitati
  currentStudents: number,         // Contatore attuale
  currentInstructors: number,      // Contatore attuale
  
  // Features del piano
  features: {
    customLogo: boolean,
    advancedReports: boolean,
    apiAccess: boolean,
    prioritySupport: boolean,
  },
  
  // Branding (Pro+)
  logoUrl: string | null,
  primaryColor: string,            // "#4F46E5"
  
  // Stripe
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
  
  // Ownership
  ownerId: string,                 // Firebase UID del proprietario
  isActive: boolean,
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

### 👨‍🏫 `driving_schools/{schoolId}/school_instructors`
Subcollection degli istruttori per ogni autoscuola.

```javascript
{
  userId: string | null,           // Firebase UID (null se invitato ma non registrato)
  name: string,
  email: string,
  phone: string | null,
  
  role: "owner" | "admin" | "instructor",
  
  permissions: {
    viewStudents: boolean,
    manageStudents: boolean,
    viewReports: boolean,
    exportData: boolean,
    manageInstructors: boolean,
    billing: boolean,
  },
  
  isActive: boolean,
  invitedAt: Timestamp | null,
  inviteAcceptedAt: Timestamp | null,
  joinedAt: Timestamp | null,
  
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

### 👨‍🎓 `driving_schools/{schoolId}/school_students`
Subcollection degli studenti per ogni autoscuola.

```javascript
{
  userId: string | null,           // Firebase UID (null se solo invitato)
  name: string,
  email: string | null,
  phone: string | null,
  
  // Istruttore assegnato
  assignedInstructorId: string | null,
  
  // Stato iscrizione
  enrollmentStatus: "active" | "suspended" | "completed" | "withdrawn",
  enrollmentDate: Timestamp,
  expectedExamDate: Timestamp | null,
  
  // Statistiche (sincronizzate da quiz dell'utente)
  averageScore: number | null,     // 0-100
  totalQuizzes: number,
  totalSimulations: number,
  lastScore: number | null,
  lastActivity: Timestamp | null,
  
  // Obiettivi
  targetScore: number,             // Default: 80
  isReadyForExam: boolean,
  readyForExamDate: Timestamp | null,
  
  // Esame
  actualExamDate: Timestamp | null,
  examPassed: boolean | null,
  examAttempts: number,
  
  // Per tracciamento
  flaggedForReview: boolean,
  instructorNotes: string | null,
  
  // Invito
  inviteCode: string | null,       // "STU-XXXXX"
  inviteSentAt: Timestamp | null,
  inviteAcceptedAt: Timestamp | null,
  
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

### 💳 `school_subscriptions`
Storico abbonamenti autoscuole.

```javascript
{
  schoolId: string,                // Reference a driving_schools
  
  plan: "starter" | "pro" | "enterprise",
  billingCycle: "monthly" | "yearly",
  amount: number,                  // In EUR
  currency: "EUR",
  
  status: "active" | "cancelled" | "past_due" | "expired",
  
  startDate: Timestamp,
  endDate: Timestamp | null,       // null = attivo
  cancelledAt: Timestamp | null,
  
  // Stripe
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

---

### 🧾 `school_invoices`
Fatture emesse alle autoscuole.

```javascript
{
  schoolId: string,
  
  invoiceNumber: string,           // "INV-2024-001"
  
  amount: number,                  // Imponibile
  taxAmount: number,               // IVA
  totalAmount: number,             // Totale
  currency: "EUR",
  
  items: [
    {
      description: string,
      quantity: number,
      unitPrice: number,
      total: number,
    }
  ],
  
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled",
  issuedAt: Timestamp,
  dueDate: Timestamp,
  paidAt: Timestamp | null,
  
  // Stripe
  stripeInvoiceId: string | null,
  pdfUrl: string | null,
  
  createdAt: Timestamp,
}
```

---

### 📨 `school_messages`
Messaggi tra autoscuola e studenti.

```javascript
{
  schoolId: string,
  
  // Mittente
  senderType: "instructor" | "system",
  senderId: string | null,         // userId dell'istruttore
  senderName: string,
  
  // Destinatari
  recipientType: "all_students" | "student" | "group",
  recipientId: string | null,      // studentId se singolo studente
  
  // Contenuto
  subject: string,
  message: string,
  messageType: "info" | "reminder" | "alert" | "congratulation",
  
  // Tracking
  sentAt: Timestamp,
  readBy: [                        // Array di studenti che hanno letto
    {
      studentId: string,
      readAt: Timestamp,
    }
  ],
}
```

---

### 📊 `school_student_activity`
Log attività studenti per report autoscuola.

```javascript
{
  schoolId: string,
  studentId: string,               // school_students ID
  userId: string,                  // Firebase UID
  
  activityType: "quiz_completed" | "simulation_completed" | "topic_studied" | "login",
  
  details: {
    score: number | null,
    totalQuestions: number | null,
    passed: boolean | null,
    topicId: string | null,
  },
  
  createdAt: Timestamp,
}
```

---

## Modifiche a Collezioni Esistenti

### 👤 `users` (modifiche)
Aggiunti campi per collegamento autoscuola.

```javascript
{
  // ... campi esistenti ...
  
  // Nuovo: Collegamento Autoscuola
  schoolId: string | null,         // ID autoscuola se iscritto
  schoolStudentId: string | null,  // ID in school_students
  enrolledViaSchool: boolean,      // true = premium via scuola
  
  // Nuovo: Ruolo per school owners
  role: "user" | "school_owner" | "admin",
}
```

---

## Regole di Sicurezza Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Funzioni helper
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isSchoolMember(schoolId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/driving_schools/$(schoolId)/school_instructors/$(request.auth.uid));
    }
    
    function isSchoolOwner(schoolId) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/driving_schools/$(schoolId)).data.ownerId == request.auth.uid;
    }
    
    // Autoscuole
    match /driving_schools/{schoolId} {
      allow read: if isSchoolMember(schoolId);
      allow create: if isAuthenticated();
      allow update: if isSchoolOwner(schoolId);
      
      // Istruttori
      match /school_instructors/{instructorId} {
        allow read: if isSchoolMember(schoolId);
        allow write: if isSchoolOwner(schoolId);
      }
      
      // Studenti
      match /school_students/{studentId} {
        allow read: if isSchoolMember(schoolId) || 
                      resource.data.userId == request.auth.uid;
        allow create: if isSchoolMember(schoolId);
        allow update: if isSchoolMember(schoolId) || 
                        resource.data.userId == request.auth.uid;
      }
    }
    
    // Abbonamenti (solo lettura per owner)
    match /school_subscriptions/{subId} {
      allow read: if isAuthenticated() && 
        isSchoolOwner(resource.data.schoolId);
    }
    
    // Fatture
    match /school_invoices/{invoiceId} {
      allow read: if isAuthenticated() && 
        isSchoolOwner(resource.data.schoolId);
    }
    
    // Messaggi
    match /school_messages/{messageId} {
      allow read: if isAuthenticated() && (
        isSchoolMember(resource.data.schoolId) ||
        exists(/databases/$(database)/documents/driving_schools/$(resource.data.schoolId)/school_students/$(request.auth.uid))
      );
      allow create: if isSchoolMember(resource.data.schoolId);
    }
    
    // Attività studenti (scrittura solo da Cloud Functions)
    match /school_student_activity/{activityId} {
      allow read: if isAuthenticated() && 
        isSchoolMember(resource.data.schoolId);
      allow write: if false; // Solo Cloud Functions
    }
  }
}
```

---

## Indici Suggeriti

```
# driving_schools
schoolCode ASC

# driving_schools/{schoolId}/school_students
userId ASC
enrollmentStatus ASC, lastActivity DESC
isReadyForExam ASC, averageScore DESC

# school_messages
schoolId ASC, sentAt DESC

# school_student_activity
schoolId ASC, createdAt DESC
studentId ASC, createdAt DESC
```

---

## Diagram ER

```
┌─────────────────────┐
│   driving_schools   │
├─────────────────────┤
│ id                  │
│ name, schoolCode    │
│ plan, planStatus    │
│ ownerId             │
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────┐     ┌────────────────────┐
│ school_instructors  │     │   school_students  │
├─────────────────────┤     ├────────────────────┤
│ userId, name        │     │ userId, name       │
│ role, permissions   │     │ enrollmentStatus   │
└─────────────────────┘     │ assignedInstructorId│
                            │ averageScore       │
                            └──────────┬─────────┘
                                       │
                                       │ 1:N
                                       ▼
                            ┌────────────────────┐
                            │ school_student_    │
                            │     activity       │
                            ├────────────────────┤
                            │ activityType       │
                            │ details            │
                            └────────────────────┘

┌─────────────────────┐     ┌────────────────────┐
│ school_subscriptions│     │   school_invoices  │
├─────────────────────┤     ├────────────────────┤
│ schoolId            │     │ schoolId           │
│ plan, status        │     │ invoiceNumber      │
│ stripeSubscriptionId│     │ amount, status     │
└─────────────────────┘     └────────────────────┘

┌─────────────────────┐
│   school_messages   │
├─────────────────────┤
│ schoolId            │
│ recipientType       │
│ message, messageType│
└─────────────────────┘
```
