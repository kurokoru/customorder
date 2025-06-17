import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

function TableHeadCustomRecords() {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead className="p-4">Transaction Id</TableHead>
          <TableHead className="p-4">Status</TableHead>
          <TableHead className="hidden md:table-cell p-4">
            Total Items
          </TableHead>
          <TableHead className="hidden md:table-cell p-4">
            Total Quantity
          </TableHead>
          <TableHead className="p-4">Total Amount</TableHead>
          <TableHead className="hidden md:table-cell p-4">Created At</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
    </>
  );
}

export default TableHeadCustomRecords;
