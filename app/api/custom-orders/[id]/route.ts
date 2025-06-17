import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request handler to fetch custom order items by customTransactionId
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch custom transaction with the given id
    const customTransaction = await prisma.customTransaction.findUnique({
      where: { id },
    });

    // Return 404 if custom transaction is not found
    if (!customTransaction) {
      return NextResponse.json(
        { message: 'Custom transaction not found' },
        { status: 405 }
      );
    }

    // Fetch custom order items with detailed information
    const customOrderItems = await prisma.customOrderItem.findMany({
      where: { customTransactionId: id },
      orderBy: {
        itemName: 'asc',
      },
    });

    // Return 404 if no custom order items are found for the given customTransactionId
    if (!customOrderItems.length) {
      return NextResponse.json(
        { message: 'Custom order items not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customOrderItems, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH request handler to update a custom order item
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();

    // Update the custom order item with the specified id
    const editedCustomOrderItem = await prisma.customOrderItem.update({
      where: {
        id: String(params.id),
      },
      data: {
        itemName: body.itemName,
        price: body.price,
        quantity: body.quantity,
      },
    });

    // Return the updated custom order item in the response
    return NextResponse.json(editedCustomOrderItem, { status: 201 });
  } catch (error: any) {
    // Handle errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};

// DELETE request handler to delete a custom order item
export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // Delete the custom order item with the specified id
    const deletedCustomOrderItem = await prisma.customOrderItem.delete({
      where: {
        id: String(params.id),
      },
    });

    // Return a success message in the response
    return NextResponse.json(deletedCustomOrderItem, { status: 200 });
  } catch (error: any) {
    // Handle errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
};