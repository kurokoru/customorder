'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, User, Coffee, Bed, Utensils, Receipt, Download } from 'lucide-react';
import { WizardData } from '../CustomOrderWizard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ReloadIcon } from '@radix-ui/react-icons';
import jsPDF from 'jspdf';

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

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = 30;

    // Header - Company Info
    doc.setFontSize(20);
    doc.setFont('', 'bold');
    doc.text('PESONA RESTAURANT AND ROOM', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 15;
    doc.setFontSize(10);
    doc.setFont('', 'normal');
    doc.text('Jl. Soekarno Hatta', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 10;
    doc.text('Labuan Bajo, Manggarai Barat', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 10;
    doc.text('Phone: 082145250266', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 10;
    doc.text('Email: hallpesona@gmail.com', pageWidth / 2, currentY, { align: 'center' });

    currentY += 20;

    // Invoice Header
    doc.setFontSize(12);
    doc.setFont('', 'bold');
    
    // Right side - Invoice details
    const rightX = pageWidth - margin - 60;
    doc.setFillColor(0, 0, 0);
    doc.rect(rightX, currentY, 60, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE #', rightX + 2, currentY + 6);
    doc.text('DATE', rightX + 35, currentY + 6);
    
    currentY += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFont('', 'normal');
    doc.text(Date.now().toString().slice(-6), rightX + 2, currentY + 6);
    doc.text(new Date().toLocaleDateString(), rightX + 35, currentY + 6);

    currentY += 20;

    // Bill To Section
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, currentY, 50, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('', 'bold');
    doc.text('BILL TO', margin + 2, currentY + 6);

    currentY += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFont('', 'normal');
    doc.text(`Guest Name: ${data.customerName || 'N/A'}`, margin, currentY);
    
    currentY += 10;
    doc.text(`Cashier: ${data.cashierName}`, margin, currentY);
    
    currentY += 10;
    doc.text(`Service Type: ${data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)}`, margin, currentY);

    // Service details on right
    const serviceDetailsY = currentY - 20;
    doc.setFillColor(0, 0, 0);
    doc.rect(rightX, serviceDetailsY, 60, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('', 'bold');
    doc.text('Room No:', rightX + 2, serviceDetailsY + 6);
    doc.text('Res. No:', rightX + 35, serviceDetailsY + 6);

    currentY += 20;

    // Items Table Header
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('', 'bold');
    doc.text('DESCRIPTION', margin + 2, currentY + 6);
    doc.text('No. Kamar', margin + 60, currentY + 6);
    doc.text('QTY', margin + 100, currentY + 6);
    doc.text('UNIT PRICE', margin + 120, currentY + 6);
    doc.text('AMOUNT (IDR)', margin + 150, currentY + 6);

    currentY += 8;

    // Items
    doc.setTextColor(0, 0, 0);
    doc.setFont('', 'normal');
    
    data.items.forEach((item, index) => {
      if (currentY > 250) { // New page if needed
        doc.addPage();
        currentY = 30;
      }
      
      // Draw row border
      doc.rect(margin, currentY, pageWidth - 2 * margin, 12);
      
      doc.text(item.itemName, margin + 2, currentY + 8);
      doc.text(item.reference || '-', margin + 60, currentY + 8);
      doc.text(item.quantity.toString(), margin + 100, currentY + 8);
      doc.text(`Rp.${item.price.toFixed(0)}`, margin + 120, currentY + 8);
      doc.text(`Rp.${(item.price * item.quantity).toFixed(0)}`, margin + 150, currentY + 8);
      
      currentY += 12;
    });

    // Add some empty rows for the table
    for (let i = 0; i < 5; i++) {
      doc.rect(margin, currentY, pageWidth - 2 * margin, 12);
      currentY += 12;
    }

    currentY += 10;

    // Thank you message
    doc.text('Thank you for your business!', margin, currentY);

    // Totals section
    const totalsX = pageWidth - margin - 80;
    currentY += 20;
    
    doc.setFont('', 'bold');
    doc.text('SUBTOTAL', totalsX, currentY);
    doc.text(`Rp.${calculateSubtotal().toFixed(0)}`, totalsX + 40, currentY);
    
    currentY += 10;
    doc.text('TOTAL', totalsX, currentY);
    doc.text(`Rp.${calculateTotal().toFixed(0)}`, totalsX + 40, currentY);

    currentY += 30;

    // Agreement text
    doc.setFont('', 'normal');
    doc.setFontSize(8);
    doc.text('Regardless of the billing instruction I agree to be held personally liable for payment of the total amount of this bill', 
             margin, currentY, { maxWidth: pageWidth - 2 * margin });

    currentY += 20;

    // Signature section
    doc.text('Cashier Signature', margin, currentY);
    doc.text('Guest Signature', pageWidth - margin - 50, currentY);

    // Save the PDF
    doc.save(`invoice-${Date.now()}.pdf`);
    toast.success('PDF exported successfully!');
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
                {data.serviceType}
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
                    <span className="font-medium break-words max-w-[120px]">{item.orderDate} </span>
                    <span className="font-medium break-words max-w-[120px]">{item.itemName} </span>
                    <span className="font-medium break-words max-w-[120px]">{item.reference} </span>
                    <span className="text-muted-foreground ml-0 sm:ml-2 break-words max-w-[120px]">
                      Rp.{item.price.toFixed(2)} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium sm:text-right w-full sm:w-auto break-words max-w-[120px]">
                    Rp.{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tax Rate Input */}
          <div className="space-y-2 max-w-xs w-full">
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
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm sm:text-base">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
        <Button
          onClick={generatePDF}
          // disabled={data.items.length === 0}
          size="lg"
          variant="outline"
          className="w-full sm:w-auto px-8"
        >
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
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
      </div>

      {/* Download PDF Button */}
      <div className="flex justify-center w-full">
        <Button
          onClick={generatePDF}
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
          <p><strong>Service Type:</strong> {data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)}</p>
          <p><strong>Processed By:</strong> {data.cashierName}</p>
        </CardContent>
      </Card>
    </div>
  );
}
