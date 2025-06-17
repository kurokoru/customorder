import React from 'react';
import CustomOrderForm from '@/components/order/custom/CustomOrderForm';
import ErrorBoundary from '@/components/toaster/toaster';

const CustomOrderPage = () => {
  return (
    <div className="w-full h-full">
      <ErrorBoundary>
        <CustomOrderForm />
      </ErrorBoundary>
    </div>
  );
};

export default CustomOrderPage;
