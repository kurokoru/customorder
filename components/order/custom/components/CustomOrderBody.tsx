import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CustomOrderItem } from '../CustomOrderForm';
import { CustomOrderEditDialog } from './CustomOrderEditDialog';
import { CustomOrderDeleteDialog } from './CustomOrderDeleteDialog';

// Interface for the CustomOrderBody component
interface CustomOrderBodyProps {
  data: CustomOrderItem[];
}

// CustomOrderBody component to render the table body for custom order data
function CustomOrderBody({ data }: CustomOrderBodyProps) {
  return (
    <>
      <TableBody>
        {data.map((item) => {
          // Calculate the total price for each item
          const totalPrice = item.price * item.quantity;

          return (
            // Render a table row for each item
            <TableRow key={item.id}>
              {/* Render the item name */}
              <TableCell>
                <div className="font-medium">
                  {item.itemName.charAt(0).toUpperCase() +
                    item.itemName.slice(1).toLowerCase()}
                </div>
                {/* Render the item ID */}
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {item.id}
                </div>
              </TableCell>
              {/* Render the item price */}
              <TableCell className="hidden md:table-cell">
                Rp.{item.price.toFixed(2)}
              </TableCell>
              {/* Render the quantity */}
              <TableCell className="hidden sm:table-cell">
                {item.quantity}
              </TableCell>
              {/* Render the total price */}
              <TableCell className="hidden sm:table-cell">
                Rp.{totalPrice.toFixed(2)}
              </TableCell>
              {/* Render edit and delete buttons */}
              <TableCell className="text-right">
                <CustomOrderEditDialog data={item} />
                <CustomOrderDeleteDialog data={item} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </>
  );
}

export default CustomOrderBody;
