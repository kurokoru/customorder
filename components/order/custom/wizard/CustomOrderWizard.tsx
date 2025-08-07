'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Bed, Utensils} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CashierServiceStep from './components/CashierServiceStep';
import ItemsStep from './components/ItemsStep';
import ReviewStep from './components/ReviewStep';

export interface WizardData {
  cashierName: string;
  customerName: string;
  arrival: string;
  departure: string;
  invoice: string;
  serviceType: 'restaurant' | 'room' | 'packages' | '';
  paymentMethod: 'app' | 'transfer' | 'card' | 'cash' | '';
  downPayment: number;
  items: {
    id: string;
    itemName: string;
    reference: string;
    price: number;
    quantity: number;
    orderDate: string;
  }[];
}


export const ServiceOptions = [
  { value: 'restaurant', label: 'Restaurant', icon: Utensils, color: 'bg-orange-500' },
  { value: 'room', label: 'Room', icon: Bed, color: 'bg-blue-500' },
  { value: 'packages', label: 'Room & Restaurant', icon: Package, color: 'bg-green-500' },
] as const;


export default function CustomOrderWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    cashierName: '',
    serviceType: '',
    customerName: '',
    departure: '',
    arrival: '',
    paymentMethod: '',
    invoice: '',
    downPayment: 0,
    items: [],
  });

  const totalSteps = 3;

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          wizardData.cashierName.trim() !== '' &&
          wizardData.customerName.trim() !== '' &&
          wizardData.serviceType !== '' &&
          wizardData.paymentMethod !== '' &&
          wizardData.arrival !== '' &&
          wizardData.departure !== ''
          // Note: Invoice is not required in validation since it auto-generates when blank
        );
      case 2:
        return wizardData.items.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Cashier & Service Information';
      case 2:
        return 'Add Items';
      case 3:
        return 'Review Order';
      default:
        return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CashierServiceStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      case 2:
        return (
          <ItemsStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      case 3:
        return (
          <ReviewStep
            data={wizardData}
            onUpdate={updateWizardData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="h-full w-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{getStepTitle()}</span>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </CardTitle>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {renderStepContent()}
        </CardContent>

        {/* Navigation buttons */}
        <div className="p-6 border-t bg-muted/50 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={currentStep === totalSteps ? () => setCurrentStep(1) : nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            {currentStep === totalSteps ? 'New Order' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
