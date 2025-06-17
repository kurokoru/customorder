/* eslint-disable react/no-unescaped-entities */
'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import eventBus from '@/lib/even';
import { ReloadIcon } from '@radix-ui/react-icons';
import * as DialogR from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { toast } from 'react-toastify';

// Schema for custom order validation
const customOrderSchema = z.object({
  itemName: z.string().min(1, 'Item name is required').min(2, 'Item name must be at least 2 characters'),
  price: z.number().positive('Price must be a positive number').min(0.01, 'Price must be at least $0.01'),
  quantity: z.number().positive('Quantity must be a positive number').min(1, 'Quantity must be at least 1'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
});

export function CustomOrderAddDialog({
  open,
  onClose,
  transactionId,
}: {
  open: boolean;
  onClose: () => void;
  transactionId: string | null;
}) {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const priceNumber = parseFloat(price) || 0;
  const quantityNumber = parseFloat(quantity) || 0;

  useEffect(() => {
    if (!open) {
      // Reset form when dialog is closed
      setItemName('');
      setPrice('');
      setQuantity('');
      setError({});
    }
  }, [open]);

  const handleCancel = () => {
    setItemName('');
    setPrice('');
    setQuantity('');
    onClose();
    setError({});
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const validatedData = customOrderSchema.parse({
        itemName: itemName,
        price: priceNumber,
        quantity: quantityNumber,
        transactionId: transactionId,
      });

      // Send validated data using axios
      await axios.post('/api/custom-orders', validatedData);

      // If no errors, close the dialog
      onClose();
      setItemName('');
      setPrice('');
      setQuantity('');
      // Emit an event to trigger fetchCustomOrderData
      eventBus.emit('fetchCustomOrderData');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setError((prevError) => ({
          ...prevError,
          ...fieldErrors,
        }));
      } else {
        toast.error(
          'An unexpected error occurred: ' + (error as Error).message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogR.Content className="sm:max-w-[425px] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Custom Item</DialogTitle>
          <DialogDescription>Transaction ID: {transactionId}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="itemName" className="text-right">
              Item Name
            </Label>
            <Input
              id="itemName"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setError((prevError) => ({ ...prevError, itemName: '' }));
              }}
              className="col-span-3"
              placeholder="Enter item name"
            />
            {error?.itemName && (
              <div className="col-start-2 col-span-3 text-red-500 text-sm">
                {error.itemName}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price ($)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setError((prevError) => ({ ...prevError, price: '' }));
              }}
              className="col-span-3"
              placeholder="0.00"
            />
            {error?.price && (
              <div className="col-start-2 col-span-3 text-red-500 text-sm">
                {error.price}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError((prevError) => ({ ...prevError, quantity: '' }));
              }}
              className="col-span-3"
              placeholder="1"
            />
            {error?.quantity && (
              <div className="col-start-2 col-span-3 text-red-500 text-sm">
                {error.quantity}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleAdd} type="submit" disabled={loading}>
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Item'
            )}
          </Button>
        </DialogFooter>
      </DialogR.Content>
    </Dialog>
  );
}
