import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expensetable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    const expenses = await db.select().from(expensetable)
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return NextResponse.json({expenses, totalAmount});
}

export async function POST(request: Request) {
    const expense = await request.json();
    const newExpense = await db.insert(expensetable).values(expense);
    return NextResponse.json(newExpense, { status: 201 });
}

export async function PUT(request: Request) {
    const expense = await request.json();
    console.log(expense)
    await db.update(expensetable).set(expense).where(eq(expensetable.id, expense.id));
    return NextResponse.json({ message: 'Expense deleted' });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    await db.delete(expensetable).where(eq(expensetable.id, id));
    return NextResponse.json({ message: 'Expense deleted' });
}