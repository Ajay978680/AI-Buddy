import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { HistoryTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req: any)  {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { recordId, content, userEmail } = body;
    const email = user?.primaryEmailAddress?.emailAddress || userEmail;
    if (!recordId || !email) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await db.insert(HistoryTable).values({
        recordId,
        content,
        userEmail: email,
        createdAt: new Date().toISOString(),
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error inserting history:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: any) {
  const {content, recordId} = await req.json();
    try {
        if (!recordId) {
        return NextResponse.json({ error: "Missing recordId" }, { status: 400 });
        }
        const result = await db.update(HistoryTable)
        .set({ content })
        .where(eq(HistoryTable.recordId, recordId));
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error updating history:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const recordId = searchParams.get('recordId');
  if (!recordId) {
    return NextResponse.json({ error: 'Missing recordId' }, { status: 400 });
  }
  try {
    const result = await db.select().from(HistoryTable).where(eq(HistoryTable.recordId, recordId));
    if (result.length === 0) {
      return NextResponse.json({ content: [] });
    }
    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}