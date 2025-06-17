import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Initialize Prisma client
const prisma = new PrismaClient();

// Handler function for POST request to create a new custom order item
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Create a new custom order item
    const customOrderItem = await prisma.customOrderItem.create({
      data: {
        customTransactionId: body.transactionId,
        itemName: body.itemName,
        price: body.price,
        quantity: body.quantity,
      },
    });

    // Return the created custom order item in the response
    return NextResponse.json(customOrderItem, { status: 201 });
  } catch (error: any) {
    // Handle errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};