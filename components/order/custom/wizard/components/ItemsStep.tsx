'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2, Edit3,Calendar } from 'lucide-react';
import { WizardData, ServiceOptions } from '../CustomOrderWizard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDateToDDMMYYYY } from '@/lib/utils';
import Rupiah from '@/lib/rupiah';

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
    orderDate: data.arrival || '',
    itemName: '',
    price: '',
    reference: '',
    quantity: 1,
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderDate, setOrderDate] = useState<Date | undefined>(data.arrival ? new Date(data.arrival) : undefined);
  const [priceFocused, setPriceFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Menu items data
  const menuItems = [
    // Rooms
    { name: 'Pesona Room - Deluxe Family', price: 700000, ref: 'ROOM-001', image: '🏨', desc: 'Family room with sea view', category: 'room', type: 'Room' },
    { name: 'Pesona Room - Deluxe Twin', price: 450000, ref: 'ROOM-002', image: '🛏️', desc: 'Twin bed deluxe room', category: 'room', type: 'Room' },
    { name: 'Pesona Room - Deluxe Sea View', price: 420000, ref: 'ROOM-003', image: '🌊', desc: 'Sea view deluxe room', category: 'room', type: 'Room' },
    { name: 'Pesona Room - Deluxe Double', price: 360000, ref: 'ROOM-004', image: '🛏️', desc: 'Double bed deluxe room', category: 'room', type: 'Room' },
    { name: 'Pesona Room - Deluxe Single', price: 300000, ref: 'ROOM-005', image: '🛌', desc: 'Single bed deluxe room', category: 'room', type: 'Room' },
    { name: 'Labuan Bajo Room - Deluxe Double Balcony', price: 310000, ref: 'ROOM-006', image: '🏖️', desc: 'Double room with balcony', category: 'room', type: 'Room' },
    { name: 'Labuan Bajo Room - Deluxe Single', price: 300000, ref: 'ROOM-007', image: '🏖️', desc: 'Single room Labuan Bajo', category: 'room', type: 'Room' },
    
    // Food & Beverages - Fish/Seafood
    { name: 'Grilled Medium Whole Snapper', price: 100000, ref: 'FOOD-001', image: '🐟', desc: 'Fresh grilled snapper', category: 'food', type: 'Seafood' },
    { name: 'Fried Medium Whole Snapper', price: 100000, ref: 'FOOD-002', image: '🐟', desc: 'Crispy fried snapper', category: 'food', type: 'Seafood' },
    { name: 'Fish Steak', price: 70000, ref: 'FOOD-003', image: '🐟', desc: 'Grilled fish steak', category: 'food', type: 'Seafood' },
    { name: 'Stir Fried Fish In Chilli Sauce', price: 60000, ref: 'FOOD-004', image: '🌶️', desc: 'Spicy fish stir fry', category: 'food', type: 'Seafood' },
    { name: 'BBQ Fish Kebab', price: 75000, ref: 'FOOD-005', image: '🍢', desc: 'Barbecued fish kebab', category: 'food', type: 'Seafood' },
    { name: 'Fish Cordon Bleu', price: 75000, ref: 'FOOD-006', image: '🐟', desc: 'Fish cordon bleu style', category: 'food', type: 'Seafood' },
    { name: 'Grilled Whole Snapper', price: 70000, ref: 'FOOD-007', image: '🐟', desc: 'Whole grilled snapper', category: 'food', type: 'Seafood' },
    { name: 'Steamed Whole Snapper', price: 70000, ref: 'FOOD-008', image: '🐟', desc: 'Steamed fresh snapper', category: 'food', type: 'Seafood' },
    { name: 'Grilled Tuna', price: 65000, ref: 'FOOD-009', image: '🐟', desc: 'Fresh grilled tuna', category: 'food', type: 'Seafood' },
    { name: 'Sweet Sour Prawn', price: 80000, ref: 'FOOD-010', image: '🦐', desc: 'Sweet & sour prawns', category: 'food', type: 'Seafood' },
    { name: 'Garlic Prawn', price: 80000, ref: 'FOOD-011', image: '🦐', desc: 'Garlic butter prawns', category: 'food', type: 'Seafood' },
    { name: 'Squid Kebab', price: 80000, ref: 'FOOD-012', image: '🦑', desc: 'Grilled squid kebab', category: 'food', type: 'Seafood' },
    { name: 'Squid Garlic', price: 70000, ref: 'FOOD-013', image: '🦑', desc: 'Garlic squid stir fry', category: 'food', type: 'Seafood' },
    { name: 'Squid Stir Fried', price: 70000, ref: 'FOOD-014', image: '🦑', desc: 'Stir fried squid', category: 'food', type: 'Seafood' },
    
    // Indonesian Fish Dishes
    { name: 'Ikan Bakar', price: 100000, ref: 'FOOD-015', image: '🔥', desc: 'Indonesian grilled fish', category: 'food', type: 'Indonesian' },
    { name: 'Ikan Goreng', price: 100000, ref: 'FOOD-016', image: '🍤', desc: 'Indonesian fried fish', category: 'food', type: 'Indonesian' },
    { name: 'Ikan Bumbu Bali', price: 60000, ref: 'FOOD-017', image: '🌶️', desc: 'Balinese spiced fish', category: 'food', type: 'Indonesian' },
    { name: 'Pepes Be Pasih', price: 70000, ref: 'FOOD-018', image: '🐟', desc: 'Steamed fish in banana leaf', category: 'food', type: 'Indonesian' },
    { name: 'Pepes Cumi/Udang', price: 70000, ref: 'FOOD-019', image: '🦑', desc: 'Steamed squid/prawn in banana leaf', category: 'food', type: 'Indonesian' },
    
    // Chicken Dishes
    { name: 'Ayam Bakar', price: 65000, ref: 'FOOD-020', image: '🍗', desc: 'Indonesian grilled chicken', category: 'chicken', type: 'Chicken' },
    { name: 'Chicken Cordon Bleu', price: 70000, ref: 'FOOD-021', image: '🍗', desc: 'Chicken cordon bleu style', category: 'chicken', type: 'Chicken' },
    { name: 'Chicken Steak Garlic Butter', price: 70000, ref: 'FOOD-022', image: '🍗', desc: 'Chicken steak with garlic butter', category: 'chicken', type: 'Chicken' },
    { name: 'Stir Fried Chicken In Chilli Sauce', price: 70000, ref: 'FOOD-023', image: '🌶️', desc: 'Spicy chicken stir fry', category: 'chicken', type: 'Chicken' },
    { name: 'BBQ Chicken Kebab', price: 70000, ref: 'FOOD-024', image: '🍢', desc: 'Barbecued chicken kebab', category: 'chicken', type: 'Chicken' },
    
    // Beef Dishes
    { name: 'Tenderloin Steak', price: 80000, ref: 'FOOD-025', image: '🥩', desc: 'Premium beef tenderloin', category: 'food', type: 'Beef' },
    { name: 'Mushroom Beef Steak', price: 80000, ref: 'FOOD-026', image: '🥩', desc: 'Beef steak with mushroom sauce', category: 'food', type: 'Beef' },
    { name: 'BBQ Beef Kebab', price: 80000, ref: 'FOOD-027', image: '🍢', desc: 'Barbecued beef kebab', category: 'food', type: 'Beef' },
    { name: 'Beef Cordon Bleu', price: 80000, ref: 'FOOD-028', image: '🥩', desc: 'Beef cordon bleu style', category: 'food', type: 'Beef' },
    
    // Rice & Others
    { name: 'Nasi Goreng', price: 50000, ref: 'FOOD-029', image: '🍛', desc: 'Indonesian fried rice', category: 'food', type: 'Rice' },
    { name: 'Breakfast Package', price: 50000, ref: 'SVC-001', image: '🍳', desc: 'Complete breakfast package', category: 'service', type: 'Breakfast' },
    
    // Beverages
    { name: 'Large Beer', price: 50000, ref: 'BEV-001', image: '🍺', desc: 'Large bottle beer', category: 'beverage', type: 'Beer' },
    { name: 'Medium Beer', price: 35000, ref: 'BEV-002', image: '🍺', desc: 'Medium bottle beer', category: 'beverage', type: 'Beer' },
    { name: 'Canned Beer', price: 30000, ref: 'BEV-003', image: '🥫', desc: 'Canned beer', category: 'beverage', type: 'Beer' },
    { name: 'Radler', price: 35000, ref: 'BEV-004', image: '🍺', desc: 'Beer with lemon', category: 'beverage', type: 'Beer' },
    { name: 'Fruit Juice', price: 30000, ref: 'BEV-005', image: '🧃', desc: 'Fresh fruit juice', category: 'beverage', type: 'Juice' },
    { name: 'Watermelon Juice', price: 35000, ref: 'BEV-006', image: '🍉', desc: 'Fresh watermelon juice', category: 'beverage', type: 'Juice' },
    { name: 'Milkshake', price: 40000, ref: 'BEV-007', image: '🥤', desc: 'Creamy milkshake', category: 'beverage', type: 'Milkshake' },
    { name: 'Mix Milkshake/Juice', price: 45000, ref: 'BEV-008', image: '🥤', desc: 'Mixed milkshake with fruit', category: 'beverage', type: 'Milkshake' },
    
    // Desserts
    { name: 'Dessert', price: 40000, ref: 'DES-001', image: '🍰', desc: 'Daily dessert selection', category: 'dessert', type: 'Dessert' }
  ];

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

  const addItemFromMenu = (menuItem: any) => {
    const defaultOrderDate = data.arrival || new Date().toISOString().split('T')[0];
    
    // Check if item already exists in the cart
    const existingItemIndex = data.items.findIndex(item => item.reference === menuItem.ref);
    
    if (existingItemIndex !== -1) {
      // Item exists, increment quantity
      const updatedItems = data.items.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      onUpdate({ items: updatedItems });
    } else {
      // Item doesn't exist, create new entry
      const item = {
        id: Date.now().toString(),
        orderDate: defaultOrderDate,
        itemName: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        reference: menuItem.ref,
      };

      const updatedItems = [...data.items, item];
      onUpdate({ items: updatedItems });
    }
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
    setNewItem({ 
      itemName: '', 
      price: '', 
      quantity: 1, 
      reference: '', 
      orderDate: data.arrival || '' 
    });
    setEditingItem(null);
    setIsDialogOpen(false);
    setErrors({});
    setOrderDate(data.arrival ? new Date(data.arrival) : undefined);
    setPriceFocused(false);
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
    const defaultOrderDate = data.arrival || '';
    setNewItem({ 
      itemName: '', 
      price: '', 
      quantity: 1, 
      reference: '', 
      orderDate: defaultOrderDate 
    });
    setEditingItem(null);
    setErrors({});
    setOrderDate(defaultOrderDate ? new Date(defaultOrderDate) : undefined);
    setPriceFocused(false);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Top Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Management</h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              Service: {ServiceOptions.find(s => s.value === data.serviceType)?.label}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Cashier: {data.cashierName}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Date: {formatDateToDDMMYYYY(data.arrival)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-0 h-[calc(100vh-80px)]">
        
        {/* Left Side - Available Menu Items */}
        <div className="bg-gray-50 dark:bg-gray-900 p-3 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Available Items</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: 'All', value: 'all', count: menuItems.length },
                { label: 'Rooms', value: 'room', count: menuItems.filter(item => item.category === 'room').length },
                { label: 'Food', value: 'food', count: menuItems.filter(item => item.category === 'food').length },
                { label: 'Chicken', value: 'chicken', count: menuItems.filter(item => item.category === 'chicken').length },
                { label: 'Beverages', value: 'beverage', count: menuItems.filter(item => item.category === 'beverage').length },
                { label: 'Service', value: 'service', count: menuItems.filter(item => item.category === 'service').length },
                { label: 'Desserts', value: 'dessert', count: menuItems.filter(item => item.category === 'dessert').length }
              ].map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory === category.value ? 'bg-blue-600 text-white' : ''}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label} ({category.count})
                </Button>
              ))}
            </div>

            {/* Add Custom Item Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="w-full mb-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Item' : 'Add Custom Item'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
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
                      placeholder="Enter reference"
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
                      type="text"
                      step="0"
                      min="0"
                      value={priceFocused ? newItem.price : (newItem.price ? new Rupiah(parseFloat(newItem.price) || 0).format : '')}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setNewItem({ ...newItem, price: value });
                      }}
                      onFocus={() => setPriceFocused(true)}
                      onBlur={() => setPriceFocused(false)}
                      placeholder="1000"
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>
                  <Button onClick={addItem} className="w-full">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Menu Items List */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3">
              {menuItems
                .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                .map((item, index) => (
                <Card 
                  key={index} 
                  className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addItemFromMenu(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl">
                        {item.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {item.desc}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {new Rupiah(item.price).format}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItemFromMenu(item);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Purchased Items */}
        <div className="bg-white dark:bg-gray-800 p-6 flex flex-col overflow-hidden">
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-md font-bold text-gray-900 dark:text-gray-100 mb-2">Order Items</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data.items.length} item(s) in cart
            </p>
          </div>

          {/* Purchased Items List */}
          <div className="flex-1 overflow-y-auto">
            {data.items.length === 0 ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No items in cart</p>
                  <p className="text-sm text-gray-400">Click items from the left to add them</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.items.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {/* First Row - Item Name and Actions */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                          {item.itemName}
                        </h4>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editItem(item)}
                          className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Second Row - Quantity Controls and Price */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-6 w-6 p-0 rounded"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-xs font-medium bg-white dark:bg-gray-800 rounded px-2 py-1 border">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-6 w-6 p-0 rounded"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0 min-w-0">
                        <div className="font-semibold text-green-600 dark:text-green-400 text-xs">
                          {new Rupiah(item.price * item.quantity).format}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Section */}
          {data.items.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Total Amount:
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {new Rupiah(calculateTotal()).format}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {data.items.length} item(s) • {data.items.reduce((total, item) => total + item.quantity, 0)} qty
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
