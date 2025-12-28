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

    const instructor = query.docs[0].data();
    const roleHierarchy: Record<string, number> = { owner: 3, admin: 2, instructor: 1 };

    if (roleHierarchy[instructor.role] < roleHierarchy[minRole]) {
        throw new Error('Insufficient permissions');
    }

    return instructor;
}

// GET /api/schools/[schoolId]/students - Lista studenti
export async function GET(
    request: NextRequest,
    { params }: { params: { schoolId: string } }
) {
    try {
        const decodedToken = await verifyAuth(request);
        const { schoolId } = params;
        const { searchParams } = new URL(request.url);

        await verifySchoolAccess(decodedToken.uid, schoolId);

        // Parametri query
        const status = searchParams.get('status') || 'active';
        const instructorId = searchParams.get('instructor');
        const readyForExam = searchParams.get('ready');
        const search = searchParams.get('search')?.toLowerCase();
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Query base
        let query = adminDb
            .collection('driving_schools')
            .doc(schoolId)
            .collection('school_students')
            .orderBy('createdAt', 'desc');

        // Applica filtro stato
        if (status && status !== 'all') {
            query = query.where('enrollmentStatus', '==', status);
        }

        // Esegui query
        const snapshot = await query.get();

        let students = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filtri client-side (per semplicità)
        if (instructorId && instructorId !== 'all') {
            students = students.filter((s: any) => s.assignedInstructorId === instructorId);
        }
        if (readyForExam === 'true') {
            students = students.filter((s: any) => s.isReadyForExam === true);
        }
        if (readyForExam === 'false') {
            students = students.filter((s: any) => s.isReadyForExam === false);
        }
        if (search) {
            students = students.filter((s: any) =>
                s.name?.toLowerCase().includes(search) ||
                s.email?.toLowerCase().includes(search)
            );
        }

        // Paginazione
        const total = students.length;
        const startIndex = (page - 1) * limit;
        const paginatedStudents = students.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            success: true,
            students: paginatedStudents,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

// POST /api/schools/[schoolId]/students - Aggiungi studente
export async function POST(
    request: NextRequest,
    { params }: { params: { schoolId: string } }
) {
    try {
        const decodedToken = await verifyAuth(request);
        const { schoolId } = params;

        await verifySchoolAccess(decodedToken.uid, schoolId, 'admin');

        const body = await request.json();
        const { name, email, phone, assignedInstructorId, expectedExamDate, sendInvite = true } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Verifica limiti
        const schoolDoc = await adminDb.collection('driving_schools').doc(schoolId).get();
        const school = schoolDoc.data();

        if (school?.maxStudents !== -1 && school?.currentStudents >= school?.maxStudents) {
            return NextResponse.json(
                { error: 'Student limit reached', currentCount: school.currentStudents, limit: school.maxStudents },
                { status: 400 }
            );
        }

        // Genera codice invito
        const inviteCode = `STU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // Crea studente
        const studentRef = adminDb
            .collection('driving_schools')
            .doc(schoolId)
            .collection('school_students')
            .doc();

        const studentData = {
            name,
            email: email || '',
            phone: phone || '',
            assignedInstructorId: assignedInstructorId || null,
            enrollmentStatus: 'active',
            enrollmentDate: new Date().toISOString(),
            expectedExamDate: expectedExamDate || null,
            targetScore: 80,
            isReadyForExam: false,
            flaggedForReview: false,
            inviteCode,
            inviteSentAt: sendInvite ? new Date().toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await studentRef.set(studentData);

        // Incrementa contatore
        await adminDb.collection('driving_schools').doc(schoolId).update({
            currentStudents: (school?.currentStudents || 0) + 1,
            updatedAt: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            student: { id: studentRef.id, ...studentData },
            inviteCode,
            inviteLink: `https://app.patentequiz.com/join/${inviteCode}`
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
