'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Package, Bed, Utensils, Calendar, Smartphone, CreditCard, Banknote, ArrowRightLeft } from 'lucide-react';
import { WizardData, ServiceOptions } from '../CustomOrderWizard';
import { formatCurrency } from '@/lib/currency';
import { formatDateToDDMMYYYY } from '@/lib/utils';
import Rupiah from '@/lib/rupiah'; 
interface CashierServiceStepProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

const serviceOptions = [
  { value: 'restaurant', label: 'Restaurant', icon: Utensils, color: 'bg-orange-500' },
  { value: 'room', label: 'Room', icon: Bed, color: 'bg-blue-500' },
  { value: 'packages', label: 'Room & Restaurant', icon: Package, color: 'bg-green-500' },
] as const;


const paymentOptions = [
  { value: 'app', label: 'App', icon: Smartphone },
  { value: 'transfer', label: 'Transfer Bank', icon: ArrowRightLeft },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'cash', label: 'Cash', icon: Banknote },
] as const;

export default function CashierServiceStep({ data, onUpdate }: CashierServiceStepProps) {
  const [invoice, setInvoice] = useState(data.invoice || '');
  const [cashierName, setCashierName] = useState(data.cashierName);
  const [serviceType, setServiceType] = useState(data.serviceType);
  const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod);
  const [customerName, setCustomerName] = useState(data.customerName);
  const [downPayment, setDownPayment] = useState(data.downPayment || 0);
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(
    data.arrival ? new Date(data.arrival) : undefined
  );
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    data.departure ? new Date(data.departure) : undefined
  );
  const [departureError, setDepartureError] = useState<string>('');
  const [downPaymentFocused, setDownPaymentFocused] = useState(false);
  const handleChange = (type: string, value: string ) => {
    switch (type) {
      case 'cashierName':
        setCashierName(value);
        onUpdate({ cashierName: value });
        break;
      case 'customerName':
        setCustomerName(value);
        onUpdate({ customerName: value });
        break;
      case 'invoice':
        setInvoice(value);
        onUpdate({ invoice: value });
        break;
      case 'arrivalDate':
        setArrivalDate(value ? new Date(value) : undefined);
        onUpdate({ arrival: value });
        break;
      case 'departureDate':
        setDepartureDate(value ? new Date(value) : undefined);
        onUpdate({ departure: value });
        break;
       case 'downPayment':
        setDownPayment(+value);
        onUpdate({ downPayment: +value });
        break;
      default:
        break;
    }
  };

  const handleServiceSelect = (service: 'restaurant' | 'room' | 'packages') => {
    setServiceType(service);
    onUpdate({ serviceType: service });
  };

  const handlePaymentSelect = (paymentMethod: 'app' | 'transfer' | 'card' | 'cash') => {
    setPaymentMethod(paymentMethod);
    onUpdate({ paymentMethod: paymentMethod });
  };

  return (
    <div className="space-y-6">
       {/* Invoice Name Input */}
      <div className="space-y-2">
        <Label htmlFor="invoice" className="text-base font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Invoice
        </Label>
        <Input
          id="invoice"
          type="text"
          placeholder="Enter invoice number"
          value={invoice}
          onChange={(e) => handleChange('invoice', e.target.value)}
          className="text-base"
          required
        />
        <p className="text-xs text-gray-500">
          Please enter your invoice number
        </p>
      </div>
 
      {/* Cashier Name Input */}
      <div className="space-y-2">
        <Label htmlFor="cashierName" className="text-base font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Cashier Name
        </Label>
        <Input
          id="cashierName"
          type="text"
          placeholder="Enter cashier name"
          value={cashierName}
          onChange={(e) => handleChange('cashierName', e.target.value)}
          className="text-base"
        />
        {cashierName.trim() === '' && (
          <p className="text-sm text-red-500">Cashier name is required</p>
        )}
      </div>

     {/* Service Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Service Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = serviceType === option.value;
            
            return (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleServiceSelect(option.value)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{option.label}</h3>
                  {isSelected && (
                    <Badge className="bg-blue-500">Selected</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      {/* Customer Name Input */}
      <div className="space-y-2">
        <Label htmlFor="customerName" className="text-base font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Customer Name
        </Label>
        <Input
          id="customerName"
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(e) => handleChange('customerName', e.target.value)}
          className="text-base"
        />
        {customerName.trim() === '' && (
          <p className="text-sm text-red-500">Customer name is required</p>
        )}
      </div>

      {/* Arrival Date Input */}
      <div className="space-y-2">
        <Label htmlFor="arrival" className="text-base font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Arrival Date
        </Label>
        <DatePicker
          date={arrivalDate}
          onDateChange={(date) => handleChange('arrivalDate', date ? date.toISOString() : '')}
          placeholder="Select arrival date"
          className="w-full"
        />
        {!arrivalDate && (
          <p className="text-sm text-red-500">Arrival date is required</p>
        )}
      </div>

      {/* Departure Date Input */}
      <div className="space-y-2">
        <Label htmlFor="departure" className="text-base font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Departure Date
        </Label>
        <DatePicker
          date={departureDate}
           // Prevent selecting a date before arrivalDate
          // minDate={arrivalDate}
          onDateChange={(date) => {
            if (arrivalDate && date && date < arrivalDate) {
              setDepartureError('Departure date cannot be before arrival date');
              return;
            }
            setDepartureError('');
            handleChange('departureDate', date ? date.toISOString() : '')
          }}
          // onDateChange={(date) => handleChange('departureDate', date ? date.toISOString() : '')}
          placeholder="Select departure date"
          className="w-full"
        />
        {departureError ? (
          <p className="text-sm text-red-500">{departureError}</p>
         ) : !departureDate && (
          <p className="text-sm text-red-500">Departure date is required</p>
         )}
        
      </div>
    
      <div className="space-y-2">
        <Label htmlFor="paymentType" className="text-base font-medium flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Method
        </Label>
        <Select value={paymentMethod} onValueChange={handlePaymentSelect} >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {paymentMethod.trim() === '' && (
          <p className="text-sm text-red-500">Please select a payment method</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="downPayment" className="text-base font-medium flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Down Payment 
        </Label>
        <Input
          id="downPayment"
          type="text"
          placeholder="Down Payment(IDR)"
          value={downPaymentFocused ? downPayment.toString() : new Rupiah(downPayment).format}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
            handleChange('downPayment', value);
          }}
          onFocus={() => setDownPaymentFocused(true)}
          onBlur={() => setDownPaymentFocused(false)}
          className="text-base"
        />
      </div>

      {/* Summary */}
      {cashierName.trim() !== '' && serviceType.trim() !== '' && paymentMethod.trim() !== '' && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p><strong>Invoice:</strong> {invoice}</p>
          <p><strong>Cashier:</strong> {cashierName}</p>
          <p><strong>Customer:</strong> {customerName}</p>
          {arrivalDate && <p><strong>Arrival:</strong> {formatDateToDDMMYYYY(arrivalDate.toISOString())}</p>}
          {departureDate && <p><strong>Departure:</strong> {formatDateToDDMMYYYY(departureDate.toISOString())}</p>}
          <p><strong>Service:</strong> {serviceOptions.find(s => s.value === serviceType)?.label}</p>
          <p><strong>Payment:</strong> {paymentOptions.find(p => p.value === paymentMethod)?.label}</p>
          <p><strong>Down Payment:</strong> {formatCurrency(downPayment, '')}</p>
        </div>
      )}
    </div>
  );
}
