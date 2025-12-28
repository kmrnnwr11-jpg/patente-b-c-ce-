import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

async function verifyAuth(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }
    const token = authHeader.split('Bearer ')[1];
    return await adminAuth.verifyIdToken(token);
}

async function verifySchoolAccess(userId: string, schoolId: string, minRole = 'instructor') {
    const query = await adminDb
        .collection('driving_schools')
        .doc(schoolId)
        .collection('school_instructors')
        .where('userId', '==', userId)
        .where('isActive', '==', true)
        .limit(1)
        .get();

    if (query.empty) throw new Error('Access denied');
    return query.docs[0].data();
}

// GET /api/schools/[schoolId]/dashboard - Stats dashboard
export async function GET(
    request: NextRequest,
    { params }: { params: { schoolId: string } }
) {
    try {
        const decodedToken = await verifyAuth(request);
        const { schoolId } = params;

        await verifySchoolAccess(decodedToken.uid, schoolId);

        // Ottieni dati scuola
        const schoolDoc = await adminDb.collection('driving_schools').doc(schoolId).get();
        if (!schoolDoc.exists) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 });
        }
        const school = schoolDoc.data()!;

        // Ottieni studenti
        const studentsSnapshot = await adminDb
            .collection('driving_schools')
            .doc(schoolId)
            .collection('school_students')
            .get();

        const students = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calcola statistiche
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const activeStudents = students.filter((s: any) => s.enrollmentStatus === 'active');
        const readyForExam = students.filter((s: any) => s.isReadyForExam);
        const completedThisMonth = students.filter((s: any) => {
            if (s.actualExamDate && s.examPassed) {
                const examDate = new Date(s.actualExamDate);
                return examDate >= startOfMonth;
            }
            return false;
        });

        // Studenti inattivi
        const studentsNeedingAttention = students
            .filter((s: any) => {
                if (s.enrollmentStatus !== 'active') return false;
                if (!s.lastActivity) return true;
                const lastActivity = new Date(s.lastActivity);
                return lastActivity < oneWeekAgo;
            })
            .slice(0, 5)
            .map((s: any) => ({
                id: s.id,
                name: s.name,
                reason: 'Inattivo da più di 7 giorni',
                daysSinceActivity: s.lastActivity
                    ? Math.floor((now.getTime() - new Date(s.lastActivity).getTime()) / (1000 * 60 * 60 * 24))
                    : null
            }));

        // Top performers
        const readyStudents = readyForExam
            .slice(0, 5)
            .map((s: any) => ({
                id: s.id,
                name: s.name,
                averageScore: s.averageScore || 0,
                simulationsPassed: s.simulationsPassed || 0
            }));

        // Attività recente
        const recentActivitySnapshot = await adminDb
            .collection('school_student_activity')
            .where('schoolId', '==', schoolId)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

        const recentActivity = recentActivitySnapshot.docs.map(doc => {
            const data = doc.data();
            const student = students.find((s: any) => s.id === data.studentId);
            return {
                id: doc.id,
                ...data,
                studentName: student ? (student as any).name : 'Studente'
            };
        });

        return NextResponse.json({
            success: true,
            school: {
                id: schoolId,
                name: school.name,
                schoolCode: school.schoolCode,
                plan: school.plan,
                planStatus: school.planStatus,
                trialEndsAt: school.trialEndsAt,
                logoUrl: school.logoUrl,
                primaryColor: school.primaryColor
            },
            stats: {
                totalStudents: students.length,
                activeStudents: activeStudents.length,
                readyForExam: readyForExam.length,
                completedThisMonth: completedThisMonth.length,
                averageScore: calculateAverageScore(students),
                totalQuizzesToday: 0, // TODO: calcolare
                studentsStudiedToday: 0 // TODO: calcolare
            },
            planUsage: {
                studentsUsed: school.currentStudents || 0,
                studentsLimit: school.maxStudents,
                instructorsUsed: school.currentInstructors || 0,
                instructorsLimit: school.maxInstructors
            },
            studentsNeedingAttention,
            readyStudents,
            recentActivity
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

function calculateAverageScore(students: any[]): number {
    const studentsWithScores = students.filter(s => s.averageScore !== undefined && s.averageScore !== null);
    if (studentsWithScores.length === 0) return 0;
    const total = studentsWithScores.reduce((sum, s) => sum + s.averageScore, 0);
    return Math.round(total / studentsWithScores.length);
}
