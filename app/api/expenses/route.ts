import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expensetable } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET(request: Request) { 
    const userid = request.headers.get('userid');
    const expenses = await db.select().from(expensetable).where(eq(expensetable.userid, userid!))
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return NextResponse.json({ expenses, totalAmount });
}

export async function POST(request: Request) {
    const userid = request.headers.get('userid');
    const expense = await request.json();
    const newExpense = await db.insert(expensetable).values({...expense, userid});
    return NextResponse.json(newExpense, { status: 201 });
}

export async function PUT(request: Request) {
    const userid = request.headers.get('userid');
    const expense = await request.json();

    await db.update(expensetable).set({...expense, userid}).where(eq(expensetable.id, expense.id));
    return NextResponse.json({ message: 'Expense deleted' });
}

export async function DELETE(request: Request) {
    const userid = request.headers.get('userid');
    const { id } = await request.json();
    await db.delete(expensetable).where(and(eq(expensetable.id, id), eq(expensetable.userid, userid!)));
    return NextResponse.json({ message: 'Expense deleted' });
}