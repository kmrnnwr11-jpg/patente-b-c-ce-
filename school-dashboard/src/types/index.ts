// Types for B2B School Dashboard

// Piano abbonamento autoscuola
export type SchoolPlan = 'starter' | 'pro' | 'enterprise';
export type PlanStatus = 'trial' | 'active' | 'cancelled' | 'expired' | 'past_due';
export type BillingCycle = 'monthly' | 'yearly';

// Ruoli istruttori
export type InstructorRole = 'owner' | 'admin' | 'instructor';

// Stato iscrizione studente
export type EnrollmentStatus = 'active' | 'completed' | 'paused' | 'dropped';

// Autoscuola
export interface DrivingSchool {
    id: string;
    name: string;
    businessName?: string;
    vatNumber?: string;
    taxCode?: string;

    // Contatti
    email: string;
    phone?: string;
    website?: string;

    // Indirizzo
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country: string;

    // Codice per studenti
    schoolCode: string;

    // Piano
    plan: SchoolPlan;
    planStatus: PlanStatus;
    planStart?: string;
    planEnd?: string;
    trialEndsAt?: string;

    // Limiti
    maxStudents: number;
    maxInstructors: number;
    currentStudents: number;
    currentInstructors: number;

    // Features
    features: {
        customLogo: boolean;
        advancedReports: boolean;
        apiAccess: boolean;
        prioritySupport: boolean;
    };

    // Branding
    logoUrl?: string;
    primaryColor?: string;

    // Pagamento
    stripeCustomerId?: string;
    billingEmail?: string;

    // Owner
    ownerId: string;

    // Stato
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Istruttore
export interface SchoolInstructor {
    id: string;
    schoolId: string;
    userId?: string;

    name: string;
    email: string;
    phone?: string;

    role: InstructorRole;

    permissions: {
        viewStudents: boolean;
        manageStudents: boolean;
        viewReports: boolean;
        exportData: boolean;
        manageInstructors: boolean;
        billing: boolean;
    };

    isActive: boolean;
    invitedAt?: string;
    joinedAt?: string;
    createdAt: string;
}

// Studente autoscuola
export interface SchoolStudent {
    id: string;
    schoolId: string;
    userId?: string;

    name: string;
    email?: string;
    phone?: string;

    assignedInstructorId?: string;
    assignedInstructor?: {
        id: string;
        name: string;
    };

    enrollmentStatus: EnrollmentStatus;
    enrollmentDate: string;
    expectedExamDate?: string;
    actualExamDate?: string;
    examPassed?: boolean;

    targetScore: number;

    instructorNotes?: string;

    isReadyForExam: boolean;
    flaggedForReview: boolean;

    inviteCode?: string;
    inviteSentAt?: string;
    inviteAcceptedAt?: string;

    // Stats calcolate
    stats?: StudentStats;

    createdAt: string;
    updatedAt: string;
}

// Statistiche studente
export interface StudentStats {
    totalQuizzes: number;
    averageScore: number;
    lastActivity?: string;
    daysSinceLastActivity: number;
    simulationsPassed: number;
    simulationsFailed: number;
    weakTopics: string[];
    strongTopics: string[];
    studyTimeHours: number;
    trend: 'improving' | 'stable' | 'declining';
    estimatedPassProbability: number;
}

// Abbonamento autoscuola
export interface SchoolSubscription {
    id: string;
    schoolId: string;

    plan: SchoolPlan;
    billingCycle: BillingCycle;

    amount: number;
    currency: string;

    status: PlanStatus;

    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;

    stripeSubscriptionId?: string;

    extraStudents: number;
    extraStudentsCost: number;

    createdAt: string;
    cancelledAt?: string;
}

// Fattura
export interface SchoolInvoice {
    id: string;
    schoolId: string;
    subscriptionId: string;

    invoiceNumber: string;

    amount: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;

    status: 'pending' | 'paid' | 'failed' | 'refunded';

    issuedAt: string;
    dueAt: string;
    paidAt?: string;

    pdfUrl?: string;
    stripeInvoiceId?: string;
}

// Attività studente
export interface StudentActivity {
    id: string;
    schoolId: string;
    studentId: string;
    userId?: string;

    activityType: 'quiz_completed' | 'simulation_completed' | 'topic_studied' | 'milestone_reached' | 'exam_ready';

    details: Record<string, unknown>;

    createdAt: string;
}

// Messaggio autoscuola
export interface SchoolMessage {
    id: string;
    schoolId: string;

    senderType: 'instructor' | 'school';
    senderId: string;
    senderName?: string;

    recipientType: 'student' | 'all_students' | 'group';
    recipientId?: string;
    recipientName?: string;

    subject?: string;
    message: string;

    messageType: 'info' | 'reminder' | 'alert' | 'congratulation';

    sentAt: string;
    readAt?: string;
}

// Dashboard stats
export interface SchoolDashboardStats {
    totalStudents: number;
    activeStudents: number;
    readyForExam: number;
    completedThisMonth: number;
    averageScore: number;
    totalQuizzesToday: number;
    studentsStudiedToday: number;
}

// Plan usage
export interface PlanUsage {
    studentsUsed: number;
    studentsLimit: number;
    instructorsUsed: number;
    instructorsLimit: number;
}

// Pricing
export const SCHOOL_PLANS = {
    starter: {
        name: 'Starter',
        monthlyPrice: 49,
        yearlyPrice: 490,
        maxStudents: 30,
        maxInstructors: 1,
        features: {
            customLogo: false,
            advancedReports: false,
            apiAccess: false,
            prioritySupport: false,
        },
        extraStudentCost: 2,
    },
    pro: {
        name: 'Pro',
        monthlyPrice: 99,
        yearlyPrice: 990,
        maxStudents: 100,
        maxInstructors: 5,
        features: {
            customLogo: true,
            advancedReports: true,
            apiAccess: false,
            prioritySupport: false,
        },
        extraStudentCost: 1.5,
    },
    enterprise: {
        name: 'Enterprise',
        monthlyPrice: 199,
        yearlyPrice: 1990,
        maxStudents: -1, // Illimitati
        maxInstructors: -1, // Illimitati
        features: {
            customLogo: true,
            advancedReports: true,
            apiAccess: true,
            prioritySupport: true,
        },
        extraStudentCost: 0,
    },
};
