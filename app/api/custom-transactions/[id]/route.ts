import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request handler to fetch a specific custom transaction by ID
export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // Fetch custom transaction with all items
    const customTransaction = await prisma.customTransaction.findUnique({
      where: {
        id: String(params.id),
      },
      include: {
        items: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!customTransaction) {
      return NextResponse.json(
        { error: 'Custom transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customTransaction, { status: 200 });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// PATCH request handler to update custom transaction and mark as complete
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();

    // Parse totalAmount from request body
    const totalAmount = parseFloat(body.totalAmount);
    if (isNaN(totalAmount)) {
      throw new Error('Invalid totalAmount');
    }

    // Update custom transaction with totalAmount and mark as complete
    const editCustomTransaction = await prisma.customTransaction.update({
      where: {
        id: String(params.id),
      },
      data: {
        isComplete: true,
      },
    });

    await prisma.$disconnect();

    // Return updated custom transaction
    return NextResponse.json(
      { editCustomTransaction },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// DELETE request handler to delete a custom transaction
export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // Delete custom transaction by id
    const customTransaction = await prisma.customTransaction.delete({
      where: {
        id: String(params.id),
      },
    });

    return NextResponse.json(customTransaction, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Custom transaction not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};