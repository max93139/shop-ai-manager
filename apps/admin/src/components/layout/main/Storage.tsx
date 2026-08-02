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
    if (typeof window !== 'undefined') {
      const mode = localStorage.getItem('shop_ai_storage_mode');
      if (mode === 'create') {
        setIsCreating(true);
      }
    }
  }, []);

  const handleExport = () => {
    // Export handler
  };

  const handleAddItem = () => {
    setIsCreating(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shop_ai_storage_mode', 'create');
    }
  };

  const handleBackFromCreate = () => {
    setIsCreating(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shop_ai_storage_mode');
    }
  };

  const convertBlobToBase64 = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) return url;
    if (!url.startsWith('blob:')) return url;
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const img = new window.Image();
      const imgUrl = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        const MAX = 800;
        if (w > h && w > MAX) { h *= MAX / w; w = MAX; }
        else if (h > MAX) { w *= MAX / h; h = MAX; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(imgUrl);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => { URL.revokeObjectURL(imgUrl); reject(new Error('img load fail')); };
      img.src = imgUrl;
    });
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

      // Convert blob images to base64 before sending
      let images: string[] = [];
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        images = await Promise.all(
          formData.imageUrls.slice(0, 5).map((url: string) => convertBlobToBase64(url)),
        );
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: formData.price,
        selectedSizes: formData.selectedSizes,
        selectedColors: formData.selectedColors,
        colorStocks: formData.colorStocks,
        images,
      };

      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCreating(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('shop_ai_storage_mode');
          localStorage.removeItem('shop_ai_create_product_draft');
        }
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
    return <CreateProductForm onBack={handleBackFromCreate} onSave={handleSaveProduct} />;
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
