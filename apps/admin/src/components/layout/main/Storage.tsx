'use client';

import React, { useEffect, useState } from 'react';
import { StorageHeader, CreateProductForm } from './mainComponents/storage';

export default function Storage() {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchStorageStats = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${apiUrl}/products/stats`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setTotalItems(data.totalItems || 0);
        setTotalCategories(data.totalCategories || 0);
      }
    } catch (err) {
      console.error('Failed to fetch storage stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageStats();
  }, []);

  const handleExport = () => {
    // Export handler
  };

  const handleAddItem = () => {
    setIsCreating(true);
  };

  const handleSaveProduct = async (formData: any) => {
    try {
      setSaving(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsCreating(false);
        await fetchStorageStats();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to save product to database');
      }
    } catch (err) {
      console.error('Error saving product to DB:', err);
      alert('Network error while saving product');
    } finally {
      setSaving(false);
    }
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
