'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';

type CustomOrderItems = {
  id: string;
  itemName: string;
    reference: string;
  price: number;
  quantity: number;
};

type Data = {
  totalQuantity: number;
  totalItems: number;
  id: string;
  totalAmount: string;
  createdAt: Date;
  isComplete: boolean;
  items: CustomOrderItems[];
};

export function DeleteAlertDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: Data;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleCancel = () => {
    onClose();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/custom-transactions/${data.id}`);
      onClose();
      router.refresh();
      toast.success('Custom order deleted successfully');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Server Error:', error.response?.data);
        toast.error('Failed to delete custom order');
      } else if (error instanceof Error) {
        console.error('Error:', error.message);
        toast.error('An error occurred while deleting');
      } else {
        console.error('Unknown error:', error);
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete this custom order?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            custom transaction with ID: {data.id} and all its items from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="text-gray-100"
          >
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
