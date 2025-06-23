'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  serviceType: 'food' | 'room' | 'packages' | '';
  items: {
    id: string;
    itemName: string;
    price: number;
    quantity: number;
  }[];
}

export default function CustomOrderWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    cashierName: '',
    serviceType: '',
    customerName: '',
    departure: '',
    arrival: '',
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
        return wizardData.customerName.trim() !== '';
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
            onClick={nextStep}
            disabled={!canProceed() || currentStep === totalSteps}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
