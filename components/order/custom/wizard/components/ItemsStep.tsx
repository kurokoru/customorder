'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2, Edit3,Calendar } from 'lucide-react';
import { WizardData } from '../CustomOrderWizard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';

interface ItemsStepProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

interface NewItem {
  orderDate: string;
  itemName: string;
  reference: string;
  price: string;
  quantity: number;
}

export default function ItemsStep({ data, onUpdate }: ItemsStepProps) {
  const [newItem, setNewItem] = useState<NewItem>({
    orderDate: '',
    itemName: '',
    price: '',
    reference: '',
    quantity: 1,
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderDate, setOrderDate] = useState<Date | undefined>(undefined);
  const validateItem = (item: NewItem): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (item.itemName.trim() === '') {
      newErrors.itemName = 'Item name is required';
    }

    if (item.orderDate.trim() === '') {
      newErrors.orderDate = 'Order date is required';
    }

    const priceNum = parseFloat(item.price);
    if (item.price === '' || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (item.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    if (!validateItem(newItem)) return;

    const item = {
      id: editingItem || Date.now().toString(),
      orderDate: newItem.orderDate,
      itemName: newItem.itemName.trim(),
      price: parseFloat(newItem.price),
      quantity: newItem.quantity,
      reference: newItem.reference,
    };

    let updatedItems;
    if (editingItem) {
      updatedItems = data.items.map((i) => (i.id === editingItem ? item : i));
    } else {
      updatedItems = [...data.items, item];
    }

    onUpdate({ items: updatedItems });
    setNewItem({ itemName: '', price: '', quantity: 1, reference: '', orderDate: '' });
    setEditingItem(null);
    setIsDialogOpen(false);
    setErrors({});
    setOrderDate(undefined);
  };

  const removeItem = (id: string) => {
    const updatedItems = data.items.filter((item) => item.id !== id);
    onUpdate({ items: updatedItems });
  };

  const editItem = (item: typeof data.items[0]) => {
    const itemOrderDate = item.orderDate || new Date().toISOString().split('T')[0];
    setNewItem({
      itemName: item.itemName,
      price: item.price.toString(),
      quantity: item.quantity,
      reference: item.reference,
      orderDate: itemOrderDate,
    });
    setOrderDate(new Date(itemOrderDate));
    setEditingItem(item.id);
    setIsDialogOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    const updatedItems = data.items.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    onUpdate({ items: updatedItems });
  };

  const calculateTotal = () => {
    return data.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const resetForm = () => {
    setNewItem({ itemName: '', price: '', quantity: 1, reference: '', orderDate: '' });
    setEditingItem(null);
    setErrors({});
    setOrderDate(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Service Type Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-sm">
          Service: {data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)}
        </Badge>
        <Badge variant="outline" className="text-sm">
          Cashier: {data.cashierName}
        </Badge>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
           {/* Order Date Input */}
            <div className="space-y-2">
              <Label htmlFor="orderDate" className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Order Date
              </Label>
              <DatePicker
                date={orderDate}
                onDateChange={(date) => {
                  setOrderDate(date);
                  setNewItem({ 
                    ...newItem, 
                    orderDate: date ? date.toISOString().split('T')[0] : '' 
                  });
                }}
                placeholder="Select order date"
                className="w-full"
              />
              {errors.orderDate && <p className="text-sm text-red-500">{errors.orderDate}</p>}
            </div>
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                placeholder="Enter item name"
              />
              {errors.itemName && <p className="text-sm text-red-500">{errors.itemName}</p>}
            </div>
            <div>
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                type="text"
                value={newItem.reference}
                onChange={(e) => setNewItem({ ...newItem, reference: e.target.value })}
                placeholder="enter reference"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewItem({ ...newItem, quantity: Math.max(1, newItem.quantity - 1) })}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  className="w-20 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewItem({ ...newItem, quantity: newItem.quantity + 1 })}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0"
                min="0"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="1000.00"
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>
            <Button onClick={addItem} className="w-full">
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Items List */}
      {data.items.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell className="font-medium">{item.reference}</TableCell>
                    <TableCell className="text-sm">
                      {item.orderDate ? new Date(item.orderDate).toLocaleDateString() : 'No date'}
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editItem(item)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No items added yet. Click Add Item to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
