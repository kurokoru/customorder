import React from 'react';
import CustomOrderWizard from '@/components/order/custom/wizard/CustomOrderWizard';
import ErrorBoundary from '@/components/toaster/toaster';

const CustomOrderWizardPage = () => {
  return (
    <div className="w-full h-full">
      <ErrorBoundary>
        <CustomOrderWizard />
      </ErrorBoundary>
    </div>
  );
};

export default CustomOrderWizardPage;
