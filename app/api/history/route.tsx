import { NextResponse } from 'next/server';
import { db } from '../../../configs/db';
import { HistoryTable } from '../../../configs/schema';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            return NextResponse.json(
                { error: 'Unauthorized or missing email address' },
                { status: 401 }
            );
        }
        const email = user.primaryEmailAddress.emailAddress;
        const { content, recordId } = await req.json();
        if (!recordId) {
            return NextResponse.json(
                { error: 'Missing recordId' },
                { status: 400 }
            );
        }
        // Insert record and return the inserted row
        const result = await db.insert(HistoryTable).values({
            recordId,
            content,
            userEmail: email,
            createdAt: new Date().toISOString(), // Always set createdAt
        }).returning();
        console.log('Insert result:', result);
        return NextResponse.json(result[0]);
    } catch (e: any) {
        console.error('Insert error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}