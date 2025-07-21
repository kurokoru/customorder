'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, User, Coffee, Bed, Utensils, Receipt, Download, Package } from 'lucide-react';
import { WizardData, ServiceOptions } from '../CustomOrderWizard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ReloadIcon } from '@radix-ui/react-icons';
import { generatePDF } from '@/lib/pdfGenerator';
import { formatCurrency } from '@/lib/currency';
import { formatDateToDDMMYYYY } from '@/lib/utils';
import Rupiah from '@/lib/rupiah';

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
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      case 'room':
        return <Bed className="h-4 w-4" />;
      case 'packages':
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const calculateSubtotal = () => {
    const subtotal = data.items.reduce((total, item) => total + item.price * item.quantity, 0);
    return new Rupiah(subtotal).format;
  };

  const calculateBalance = () => {
    const subtotal = data.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const balance = subtotal - data.downPayment;
    return new Rupiah(balance).format;
  };

  const calculateTotal = () => {
    const subtotal = data.items.reduce((total, item) => total + item.price * item.quantity, 0);
    return new Rupiah(subtotal).format;
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

  const handleGeneratePDF = () => {
    generatePDF({
      data,
      calculateTotal,
      calculateBalance,
    });
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
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-x-8 gap-y-2">
            <div className="flex items-center gap-2 min-w-0">
              <User className="h-4 w-4 shrink-0" />
              <span className="font-medium truncate">Cashier:</span>
              <Badge variant="outline" className="truncate max-w-[120px]">{data.cashierName}</Badge>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <User className="h-4 w-4 shrink-0" />
              <span className="font-medium truncate">Customer Name:</span>
              <Badge variant="outline" className="truncate max-w-[120px]">{data.customerName}</Badge>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              {getServiceIcon()}
              <span className="font-medium truncate">Service:</span>
              <Badge variant="outline" className="capitalize truncate max-w-[120px]">
                {ServiceOptions.find(s => s.value === data.serviceType)?.label}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold">Items Ordered:</h3>
            <div className="space-y-2 overflow-x-auto">
              {data.items.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 gap-2 sm:gap-0 border-b last:border-b-0 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full min-w-0">
                    <span className="font-medium break-words max-w-[120px]">{formatDateToDDMMYYYY(item.orderDate)} </span>
                    <span className="font-medium break-words max-w-[300px]">{item.itemName} </span>
                    <span className="font-medium break-words max-w-[600px]">{item.reference} </span>
                    <span className="text-muted-foreground ml-0 sm:ml-2 break-words max-w-[180px]">
                      {formatCurrency(item.price, '')} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium sm:text-right w-full sm:w-auto break-words max-w-[120px]">
                    {formatCurrency((item.price * item.quantity), '')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tax Rate Input */}
          {/* <div className="space-y-2 max-w-xs w-full">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div> */}

          {/* Price Breakdown */}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Subtotal:</span>
              <span>{calculateSubtotal()}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Down Payment:</span>
              <span>{new Rupiah(data.downPayment).format}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-blue-600">
              <span>Balance Due:</span>
              <span>{calculateBalance()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {/* <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
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
              submit Order
            </>
          )}
        </Button>
      </div> */}

      {/* Download PDF Button */}
      <div className="flex justify-center w-full">
        <Button
          onClick={handleGeneratePDF}
          size="lg"
          className="w-full sm:w-auto px-8 max-w-md"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Order Details for Reference */}
      <Card className="bg-muted/50 w-full">
        <CardHeader>
          <CardTitle className="text-sm">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Total Items:</strong> {data.items.length}</p>
          <p><strong>Total Quantity:</strong> {data.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
          <p><strong>Service Type:</strong> {ServiceOptions.find(s => s.value === data.serviceType)?.label}</p>
          <p><strong>Processed By:</strong> {data.cashierName}</p>
        </CardContent>
      </Card>
    </div>
  );
}
