'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, User, Coffee, Bed, Utensils, Receipt } from 'lucide-react';
import { WizardData } from '../CustomOrderWizard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ReviewStepProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

export default function ReviewStep({ data, onUpdate }: ReviewStepProps) {
  const [taxRate, setTaxRate] = useState(10); // Default 10% tax
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const getServiceIcon = () => {
    switch (data.serviceType) {
      case 'food':
        return <Utensils className="h-4 w-4" />;
      case 'room':
        return <Bed className="h-4 w-4" />;
      case 'packages':
        return <Coffee className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const calculateSubtotal = () => {
    return data.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    try {
      // Create custom transaction with cashier and service info
      const transactionResponse = await axios.post('/api/custom-transactions', {
        cashierName: data.cashierName,
        serviceType: data.serviceType,
      });
      if (transactionResponse.status !== 201) {
        throw new Error('Failed to create custom transaction');
      }

      const { id: transactionId } = transactionResponse.data;

      // Add all items to the transaction
      for (const item of data.items) {
        await axios.post('/api/custom-orders', {
          itemName: item.itemName,
          price: item.price,
          quantity: item.quantity,
          customTransactionId: transactionId,
        });
      }

      // Complete the transaction
      await axios.patch(`/api/custom-transactions/${transactionId}`, {
        totalAmount: calculateTotal(),
      });

      setOrderSubmitted(true);
      toast.success('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-600">Order Submitted Successfully!</h2>
        <p className="text-muted-foreground">
          Your custom order has been processed and saved to the system.
        </p>
        <Button onClick={() => window.location.reload()}>
          Create Another Order
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cashier and Service Info */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Cashier:</span>
              <Badge variant="outline">{data.cashierName}</Badge>
            </div>
            <div className="flex items-center gap-2">
              {getServiceIcon()}
              <span className="font-medium">Service:</span>
              <Badge variant="outline" className="capitalize">
                {data.serviceType}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold">Items Ordered:</h3>
            {data.items.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div>
                  <span className="font-medium">{item.itemName}</span>
                  <span className="text-muted-foreground ml-2">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </span>
                </div>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Tax Rate Input */}
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-32"
            />
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({taxRate}%):</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={submitOrder}
          disabled={isSubmitting || data.items.length === 0}
          size="lg"
          className="w-full sm:w-auto px-8"
        >
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Submitting Order...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Order
            </>
          )}
        </Button>
      </div>

      {/* Order Details for Reference */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Total Items:</strong> {data.items.length}</p>
          <p><strong>Total Quantity:</strong> {data.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
          <p><strong>Service Type:</strong> {data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)}</p>
          <p><strong>Processed By:</strong> {data.cashierName}</p>
        </CardContent>
      </Card>
    </div>
  );
}
