import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Table } from '@/components/ui/table';
import TableHeadCustomRecords from './components/TableHead';
import TableBodyCustomRecords from './components/TableBody';
import { fetchCustomRecords } from '@/data/customRecords';
import { PageProps } from '@/types/paginations';
import { PaginationDemo } from '@/components/paginations/pagination';
import { SearchInput } from '@/components/search/search';
import { toast } from 'react-toastify';

interface CustomOrderItem {
  id: string;
  itemName: string;
  price: number;
  quantity: number;
}

interface CustomRecordsData {
  id: string;
  cashierName: string;
  arrival: string;
  departure: string;
  customerName: string;
  serviceType: string;
  totalQuantity: number;
  totalItems: number;
  totalAmount: string;
  createdAt: Date;
  isComplete: boolean;
  items: CustomOrderItem[];
}

export async function CustomRecords(props: PageProps) {
  const pageNumber = Number(props?.searchParams?.page || 1); // Get the page number. Default to 1 if not provided.
  const take = 5;
  const skip = (pageNumber - 1) * take;
  const search =
    typeof props?.searchParams?.search === 'string'
      ? props?.searchParams?.search
      : undefined;
  
  const result = await fetchCustomRecords({ take, skip, query: search });
  if (!result) {
    // Handle the case where fetchCustomRecords returns undefined, e.g., show an error message
    toast.error('Failed to fetch custom records data');
    return;
  }
  
  const { data, metadata } = result;
  const convertedData: CustomRecordsData[] = data.map((item) => ({
    id: item.id,
    cashierName: item.cashierName,
    arrival: "arrival",
    departure: "arrival",
    customerName: "arrival",
    serviceType: item.serviceType,
    totalQuantity: item.totalQuantity,
    totalItems: item.totalItems,
    totalAmount: item.totalAmount ? item.totalAmount.toString() : "0",
    createdAt: item.createdAt,
    isComplete: item.isComplete,
    items: [],
  }));
  
  return (
    <Card x-chunk="dashboard-06-chunk-0" className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <CardHeader>
            <CardTitle>Custom Orders</CardTitle>
            <CardDescription>Manage your custom orders and transactions.</CardDescription>
          </CardHeader>
        </div>
        <div className="relative ml-auto mr-4 flex-1 md:grow-0">
          <SearchInput search={search} />
        </div>
      </div>
      <CardContent className="flex-grow">
        <Table>
          <TableHeadCustomRecords />
          <TableBodyCustomRecords data={convertedData} />
        </Table>
      </CardContent>
      <CardFooter className="mt-auto">
        <PaginationDemo {...metadata} />
      </CardFooter>
    </Card>
  );
}
