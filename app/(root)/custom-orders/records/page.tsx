import React from 'react';
import { CustomRecords } from '@/components/custom-records/table';
import { PageProps } from '@/types/paginations';

const page = async (props: PageProps) => {
  return (
    <div className="w-full h-full">
      <CustomRecords {...props} />
    </div>
  );
};

export default page;
