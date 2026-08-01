'use client';

import React, { useState } from 'react';
import { StorageHeader, CreateProductForm } from './mainComponents/storage';

export default function Storage() {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);

  const handleExport = () => {
    // Export handler
  };

  const handleAddItem = () => {
    setIsCreating(true);
  };

  const handleSaveProduct = (data: any) => {
    // Save product logic
    setIsCreating(false);
  };

  if (isCreating) {
    return <CreateProductForm onBack={() => setIsCreating(false)} onSave={handleSaveProduct} />;
  }

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
