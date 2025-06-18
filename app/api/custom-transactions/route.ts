import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Initialize Prisma client
const prisma = new PrismaClient();

// Function to generate a unique ID for a new custom transaction
const generateUniqueId = async () => {
  let isUnique = false;
  let customId = '';

  // Loop until a unique ID is generated
  while (!isUnique) {
    // Generate a new ID with the prefix 'CTXN-' and a random UUID
    customId = `CTXN-${uuidv4().slice(0, 8)}`;
    // Check if the generated ID already exists in the database
    const existingTransaction = await prisma.customTransaction.findUnique({
      where: { id: customId },
    });

    // If the ID is unique, exit the loop
    if (!existingTransaction) {
      isUnique = true;
    }
  }

  return customId;
};

// Handler function for GET request to fetch custom transactions
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;

    const [customTransactions, totalCount] = await Promise.all([
      prisma.customTransaction.findMany({
        where: {
          id: { contains: search, mode: 'insensitive' },
        },
        skip,
        take: limit,
        include: {
          items: {
            select: {
              id: true,
              itemName: true,
              price: true,
              quantity: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.customTransaction.count({
        where: {
          id: { contains: search, mode: 'insensitive' },
        },
      }),
    ]);

    // Calculate total quantity and items for each transaction
    const transactionsWithTotals = customTransactions.map((transaction) => {
      const totalQuantity = transaction.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalItems = transaction.items.length;
      
      return {
        ...transaction,
        totalQuantity,
        totalItems,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    return NextResponse.json(
      {
        data: transactionsWithTotals,
        metadata: {
          hasNextPage,
          totalPages,
          currentPage: page,
          totalCount,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// Handler function for POST request to create a new custom transaction
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    
    // Generate a unique ID for the new custom transaction
    const customId = await generateUniqueId();

    // Create a new custom transaction
    const newCustomTransaction = await prisma.customTransaction.create({
      data: {
        id: customId,
        cashierName: body.cashierName || null,
        serviceType: body.serviceType || null,
      },
    });

    return NextResponse.json(newCustomTransaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
