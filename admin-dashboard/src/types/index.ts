// User types
export interface User {
    id: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    photoURL?: string;
    role: 'user' | 'creator' | 'admin';
    isPremium: boolean;
    subscriptionStatus: 'free' | 'trial' | 'active' | 'cancelled' | 'expired';
    subscriptionPlan?: 'monthly' | 'quarterly' | 'yearly';
    subscriptionEnd?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    usedPromoCode?: string;
    referralCode?: string;

    // Stats
    totalQuizCompleted: number;
    totalCorrectAnswers: number;
    totalWrongAnswers: number;
    studyTimeMinutes: number;
    lastQuizAt?: string;

    // Metadata
    createdAt: string;
    lastLoginAt?: string;
    lastActiveAt?: string;

    // Admin
    isBanned: boolean;
    banReason?: string;
    adminNotes?: string;
}

export interface Creator {
    id: string;
    userId: string;
    email: string;
    referralCode: string;
    isActive: boolean;
    totalReferrals: number;
    activeSubscriptions: number;
    totalEarnings: number;
    pendingPayout: number;
    paidEarnings: number;
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    commissionRate: number;
    socialLinks?: {
        tiktok?: string;
        instagram?: string;
        youtube?: string;
    };
    paymentMethod?: 'paypal' | 'bank_transfer';
    paypalEmail?: string;
    bankIban?: string;
    createdAt: string;
}

export interface PromoCode {
    id: string;
    code: string;
    type: 'discount' | 'promoter' | 'launch' | 'referral' | 'special';
    discountType: 'percentage' | 'days_free' | 'fixed_amount';
    discountValue: number;
    maxUses?: number;
    currentUses: number;
    isActive: boolean;
    validFrom: string;
    validUntil?: string;
    description?: string;
    createdAt: string;
}

export interface Subscription {
    id: string;
    userId: string;
    plan: 'monthly' | 'quarterly' | 'yearly';
    status: 'active' | 'cancelled' | 'expired' | 'refunded';
    amount: number;
    currency: string;
    startedAt: string;
    expiresAt: string;
    cancelledAt?: string;
    paymentMethod: string;
    paymentId: string;
    promoCodeId?: string;
    discountAmount: number;
    autoRenew: boolean;
    createdAt: string;
}

export interface DashboardStats {
    totalUsers: number;
    premiumUsers: number;
    activeCreators: number;
    activePromoCodes: number;
    revenueThisMonth: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    quizCompletedToday: number;
    activeUsersToday: number;
    conversionRate: number;
    churnRate: number;
    pendingPayouts: number;
}

export interface Notification {
    id: string;
    targetType: 'all' | 'segment' | 'user';
    targetUserId?: string;
    segmentFilters?: Record<string, unknown>;
    title: string;
    body: string;
    channel: 'push' | 'email' | 'sms';
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    createdAt: string;
    sentAt?: string;
}

export interface SecurityLog {
    id: string;
    userId?: string;
    deviceId?: string;
    eventType: string;
    details: Record<string, unknown>;
    ipAddress?: string;
    createdAt: string;
}

export interface SpecialUser {
    id: string;
    userId?: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    type: 'influencer' | 'friend' | 'family' | 'tester' | 'staff' | 'vip';
    accessLevel: 'premium' | 'premium_plus' | 'unlimited';
    isActive: boolean;
    validFrom: string;
    validUntil?: string;
    userLinked: boolean;
    details: {
        platform?: string;
        username?: string;
        followers?: number;
        promoCode?: string;
        agreement?: string;
        relationship?: string;
        notes?: string;
    };
    notes?: string;
    reason?: string;
    addedBy?: string;
    createdAt: string;
}
