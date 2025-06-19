'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Coffee, Bed, Utensils, Calendar } from 'lucide-react';
import { WizardData } from '../CustomOrderWizard';

interface CashierServiceStepProps {
  data: WizardData;
  onUpdate: (data: Partial<WizardData>) => void;
}

const serviceOptions = [
  { value: 'food', label: 'Food', icon: Utensils, color: 'bg-orange-500' },
  { value: 'room', label: 'Room', icon: Bed, color: 'bg-blue-500' },
  { value: 'all services', label: 'Room & Restaurant', icon: Coffee, color: 'bg-green-500' },
] as const;

export default function CashierServiceStep({ data, onUpdate }: CashierServiceStepProps) {
  const [cashierName, setCashierName] = useState(data.cashierName);
  const [serviceType, setServiceType] = useState(data.serviceType);
  const [arrival, setArrival] = useState(data.arrival);
  const [departure, setDeparture] = useState(data.departure);
  const [customerName, setCustomerName] = useState(data.customerName);

  useEffect(() => {
    onUpdate({ cashierName, serviceType, arrival, departure, customerName });
  }, [cashierName, serviceType,arrival, departure, customerName, onUpdate]);

  const handleServiceSelect = (service: typeof serviceOptions[0]['value']) => {
    setServiceType(service);
  };

  return (
    <div className="space-y-6">
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
          onChange={(e) => setCustomerName(e.target.value)}
          className="text-base"
        />
        {customerName.trim() === '' && (
          <p className="text-sm text-red-500">Customer name is required</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="arrival" className="text-base font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Arrival
        </Label>
        <Input
          id="arrival"
          type="text"
          placeholder="Enter arrival"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          className="text-base"
        />
        {arrival.trim() === '' && (
          <p className="text-sm text-red-500">Arrival date is required</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="arrival" className="text-base font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Departure
        </Label>
        <Input
          id="departure"
          type="text"
          placeholder="Enter departure"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="text-base"
        />
        {cashierName.trim() === '' && (
          <p className="text-sm text-red-500">Departure is required</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="arrival" className="text-base font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Cashier 
        </Label>
        <Input
          id="cashierName"
          type="text"
          placeholder="Enter cashier name"
          value={cashierName}
          onChange={(e) => setCashierName(e.target.value)}
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
        {serviceType === '' && (
          <p className="text-sm text-red-500">Please select a service type</p>
        )}
      </div>

      {/* Summary */}
      {cashierName.trim() !== '' && serviceType !== '' && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p><strong>Cashier:</strong> {cashierName}</p>
          <p><strong>Service:</strong> {serviceOptions.find(s => s.value === serviceType)?.label}</p>
        </div>
      )}
    </div>
  );
}
