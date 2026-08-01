'use client';

import React, { useState } from 'react';
import { StorageHeader } from './mainComponents/storage';

export default function Storage() {
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);

  const handleExport = () => {
    // Export handler
  };

  const handleAddItem = () => {
    // Add product modal handler
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
      <StorageHeader
        totalItems={totalItems}
        totalCategories={totalCategories}
        onExport={handleExport}
        onAddItem={handleAddItem}
      />
    </div>
  );
}
