import { db } from '@/lib/db';
import isOnline from 'is-online';

export const fetchCustomRecords = async ({
  take = 5,
  skip = 0,
  query,
}: {
  query?: string;
  take: number;
  skip: number;
}) => {
  const isOnlineResult = await isOnline();

  if (!isOnlineResult) {
    throw new Error('No internet connection');
    return;
  }
  
  ('use server');
  try {
    const results = await db.customTransaction.findMany({
      where: {
        id: { contains: query, mode: 'insensitive' },
      },
      skip,
      take,
      select: {
        id: true,
        totalAmount: true,
        cashierName: true,
        serviceType: true,
        createdAt: true,
        isComplete: true,
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
    });

    // Calculate total quantity and items for each transaction
    const resultsWithTotalQuantity = results.map((transaction) => {
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

    const totalTransactions = await db.customTransaction.count({
      where: {
        id: { contains: query, mode: 'insensitive' },
      },
    });

    return {
      data: resultsWithTotalQuantity,
      metadata: {
        hasNextPage: skip + take < totalTransactions,
        totalPages: Math.ceil(totalTransactions / take),
      },
    };
  } finally {
    await db.$disconnect();
  }
};
