'use client';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import SkeletonRecords from '@/components/skeleton/records';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dropdown from './btn/Dropdown';

interface CustomOrderItem {
  id: string;
  itemName: string;
  reference: string;
  price: number;
  quantity: number;
}

interface CustomRecordsData {
  id: string;
  cashierName: string;
  arrival: string;
  totalItems: number;
  totalAmount: string;
  departure: string;
  customerName: string;
  serviceType: string;
  createdAt: Date;
  isComplete: boolean;
  totalQuantity: number;
  items: CustomOrderItem[];
}

interface TableBodyCustomRecordsProps {
  data: CustomRecordsData[];
}

const TableBodyCustomRecords: React.FC<TableBodyCustomRecordsProps> = ({ data }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [recordsData, setRecordsData] = useState<CustomRecordsData[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setRecordsData(data);
      setLoading(false);
    }, 1000); // Simulate a delay
  }, [data]);

  const handleRowClick = (id: string) => {
    router.push(`/custom-orders/records/${id}`);
  };

  return (
    <TableBody>
      {loading
        ? Array.from({ length: 5 }).map((_, i) => <SkeletonRecords key={i} />)
        : recordsData.map((item) => (
            <TableRow 
              key={item.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(item.id)}
            >
              <TableCell className="font-medium pl-4">{item.id}</TableCell>
              <TableCell className="hidden md:table-cell">
                {item.cashierName || 'N/A'}
              </TableCell>
                <TableCell className="hidden md:table-cell">
                {item.arrival || 'N/A'}
              </TableCell>
                <TableCell className="hidden md:table-cell">
                {item.departure || 'N/A'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {item.serviceType ? (
                  <Badge variant="outline" className="capitalize">
                    {item.serviceType}
                  </Badge>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    item.isComplete
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }
                >
                  {item.isComplete ? 'Complete' : 'Incomplete'}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell pl-20 pr-20">
                {item.totalItems}
              </TableCell>
              <TableCell className="hidden md:table-cell pl-20 pr-20">
                {item.totalQuantity}
              </TableCell>
              <TableCell className="pl-5">
                ${item.totalAmount}
              </TableCell>
              <TableCell className="hidden md:table-cell pl-3">
                {item.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Dropdown records={item} />
              </TableCell>
            </TableRow>
          ))}
    </TableBody>
  );
};

export default TableBodyCustomRecords;
