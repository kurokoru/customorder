import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { CustomOrderItem } from '../CustomOrderForm';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import eventBus from '@/lib/even';

// Interface for the CustomOrderDeleteDialog component
interface CustomOrderDeleteDialogProps {
  data: CustomOrderItem;
}

// AlertDialog component for deleting custom order items
export function CustomOrderDeleteDialog({ data }: CustomOrderDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Check if the user is online
      const isOnline = navigator.onLine;

      if (!isOnline) {
        toast.error('You are offline. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Send delete request using axios
      await axios.delete(`/api/custom-orders/${data.id}`);
      
      // Emit event to refresh the custom order data
      eventBus.emit('fetchCustomOrderData');
      
      toast.success('Custom item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete custom item: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the custom item "{data.itemName}" from your order.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
