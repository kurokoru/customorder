import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

// CustomOrderHead component to render the table head for custom orders
function CustomOrderHead() {
  return (
    <>
      {/* Render the table header */}
      <TableHeader>
        {/* Render a table row for the header */}
        <TableRow>
          {/* Render the header for item name */}
          <TableHead>Item Name</TableHead>
          {/* Render the header for price */}
          <TableHead className="hidden md:table-cell">Price</TableHead>
          {/* Render the header for quantity */}
          <TableHead className="hidden sm:table-cell">Qty</TableHead>
          {/* Render the header for amount (total price) */}
          <TableHead className="hidden sm:table-cell">Amount</TableHead>
          {/* Render an empty header for actions */}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
    </>
  );
}

export default CustomOrderHead;
