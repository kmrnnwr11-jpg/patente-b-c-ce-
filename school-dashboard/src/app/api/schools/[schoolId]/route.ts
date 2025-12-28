import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

// Helper per verificare autenticazione
async function verifyAuth(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }
    const token = authHeader.split('Bearer ')[1];
    return await adminAuth.verifyIdToken(token);
}

// Helper per verificare accesso alla scuola
async function verifySchoolAccess(userId: string, schoolId: string, minRole = 'instructor') {
    const instructorsRef = adminDb
        .collection('driving_schools')
        .doc(schoolId)
        .collection('school_instructors');

    const query = await instructorsRef
        .where('userId', '==', userId)
        .where('isActive', '==', true)
        .limit(1)
        .get();

    if (query.empty) {
        throw new Error('Access denied');
    }

    const instructor = query.docs[0].data();
    const roleHierarchy: Record<string, number> = { owner: 3, admin: 2, instructor: 1 };

    if (roleHierarchy[instructor.role] < roleHierarchy[minRole]) {
        throw new Error('Insufficient permissions');
    }

    return { instructor, instructorId: query.docs[0].id };
}

// GET /api/schools/[schoolId] - Ottieni dati autoscuola
export async function GET(
    request: NextRequest,
    { params }: { params: { schoolId: string } }
) {
    try {
        const decodedToken = await verifyAuth(request);
        const { schoolId } = params;

        await verifySchoolAccess(decodedToken.uid, schoolId);

        const schoolDoc = await adminDb.collection('driving_schools').doc(schoolId).get();

        if (!schoolDoc.exists) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            school: { id: schoolDoc.id, ...schoolDoc.data() }
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

// PUT /api/schools/[schoolId] - Aggiorna autoscuola
export async function PUT(
    request: NextRequest,
    { params }: { params: { schoolId: string } }
) {
    try {
        const decodedToken = await verifyAuth(request);
        const { schoolId } = params;

        await verifySchoolAccess(decodedToken.uid, schoolId, 'admin');

        const body = await request.json();
        const allowedFields = [
            'name', 'businessName', 'vatNumber', 'email', 'phone',
            'address', 'city', 'province', 'postalCode', 'website',
            'logoUrl', 'primaryColor'
        ];

        const updates: Record<string, any> = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }
        updates.updatedAt = new Date().toISOString();

        await adminDb.collection('driving_schools').doc(schoolId).update(updates);

        return NextResponse.json({ success: true, message: 'School updated' });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
