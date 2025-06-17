/* eslint-disable react/no-unescaped-entities */
'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import * as DialogR from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { CustomOrderItem } from '../CustomOrderForm';
import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import eventBus from '@/lib/even';
import { toast } from 'react-toastify';

// Schema for custom order validation
const customOrderEditSchema = z.object({
  itemName: z.string().min(1, 'Item name is required').min(2, 'Item name must be at least 2 characters'),
  price: z.number().positive('Price must be a positive number').min(0.01, 'Price must be at least $0.01'),
  quantity: z.number().positive('Quantity must be a positive number').min(1, 'Quantity must be at least 1'),
});

// Interface for the CustomOrderEditDialog component
interface CustomOrderEditDialogProps {
  data: CustomOrderItem;
}

// CustomOrderEditDialog component
export function CustomOrderEditDialog({ data }: CustomOrderEditDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemName, setItemName] = useState(data.itemName);
  const [price, setPrice] = useState(data.price.toString());
  const [quantity, setQuantity] = useState(data.quantity.toString());
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const priceNumber = parseFloat(price) || 0;
  const quantityNumber = parseFloat(quantity) || 0;

  const handleEdit = async () => {
    setLoading(true);
    try {
      const validatedData = customOrderEditSchema.parse({
        itemName: itemName,
        price: priceNumber,
        quantity: quantityNumber,
      });

      // Send validated data using axios
      await axios.patch(`/api/custom-orders/${data.id}`, validatedData);
      setDialogOpen(false);
      eventBus.emit('fetchCustomOrderData');
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
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
        // Handle other types of errors
        toast.error(
          'An unexpected error occurred: ' + (error as Error).message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogR.Content className="sm:max-w-[425px] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Custom Item</DialogTitle>
          <DialogDescription>
            Make changes to the custom item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editItemName" className="text-right">
              Item Name
            </Label>
            <Input
              id="editItemName"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setError((prevError) => ({ ...prevError, itemName: '' }));
              }}
              className="col-span-3"
            />
            {error?.itemName && (
              <div className="col-start-2 col-span-3 text-red-500 text-sm">
                {error.itemName}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editPrice" className="text-right">
              Price ($)
            </Label>
            <Input
              id="editPrice"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setError((prevError) => ({ ...prevError, price: '' }));
              }}
              className="col-span-3"
            />
            {error?.price && (
              <div className="col-start-2 col-span-3 text-red-500 text-sm">
                {error.price}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editQuantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="editQuantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError((prevError) => ({ ...prevError, quantity: '' }));
              }}
              className="col-span-3"
            />
            {error?.quantity && (
              <div className="col-start-2 col-span-3 text-red-500 text-sm">
                {error.quantity}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleEdit}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogR.Content>
    </Dialog>
  );
}
