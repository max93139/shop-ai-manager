'use client';

import React, { useState } from 'react';
import {
  FormHeader,
  ImageUploader,
  VariantBuilder,
  ProductDetails,
  ProductSummary,
} from './form';
import type { ColorOption } from './form/VariantBuilder';

export interface CreateProductFormProps {
  onBack: () => void;
  onSave?: (data: any) => void;
}

const DEFAULT_COLORS: ColorOption[] = [
  { name: 'Charcoal', hex: '#2B2B2E' },
  { name: 'Camel', hex: '#7A6A54' },
];

const DEFAULT_BRANDS = [
  'Nike',
  'Adidas',
  'New Balance',
  'Puma',
  'Jordan',
  'Reebok',
  'Vans',
  'Converse',
  'Under Armour',
  'Champion',
  'Zara',
  'H&M',
  'Tommy Hilfiger',
  'Calvin Klein',
  'Levi’s',
  'Pull&Bear',
  'Bershka',
  'GAP',
  'The North Face',
  'Stone Island',
  'Crocs',
  'UGG',
  'Lacoste',
  'Balenciaga',
  'Louis Vuitton',
  'Gucci',
  'Rick Owens',
  'Atelier Line',
  'Maison Nord',
  'Rowe & Co',
];

const CATEGORIES = [
  'Outerwear',
  'Knitwear',
  'Trousers',
  'Shirts',
  'Dresses',
  'Footwear',
  'Headwear',
  'Belts',
  'Bags',
  'Accessories',
  'Other',
];

export default function CreateProductForm({ onBack, onSave }: CreateProductFormProps) {
  // Product Basic State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Outerwear');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');

  // Per-color Stock State
  const [colorStocks, setColorStocks] = useState<Record<string, number>>({
    Charcoal: 20,
    Camel: 14,
  });

  // Image Upload State
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Type & Sizes State
  const [productType, setProductType] = useState('apparel');
  const [sizeMode, setSizeMode] = useState('clothing');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M']);
  const [customSizes, setCustomSizes] = useState<string[]>([]);

  // Colors State
  const [colors, setColors] = useState<ColorOption[]>(DEFAULT_COLORS);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Charcoal']);

  // Brand Options State
  const [brandOptions, setBrandOptions] = useState<string[]>(DEFAULT_BRANDS);

  const handleProductTypeChange = (typeKey: string) => {
    setProductType(typeKey);
    const presetMode =
      typeKey === 'footwear'
        ? 'shoe'
        : typeKey === 'headwear' || typeKey === 'accessory'
        ? 'onesize'
        : typeKey === 'other'
        ? 'custom'
        : 'clothing';

    setSizeMode(presetMode);
    setSelectedSizes(presetMode === 'onesize' ? ['One size'] : []);
  };

  const handleSizeModeChange = (modeKey: string) => {
    setSizeMode(modeKey);
    setSelectedSizes(modeKey === 'onesize' ? ['One size'] : []);
  };

  const handleAddBrandOption = (newBrand: string) => {
    setBrandOptions((prev) => (prev.includes(newBrand) ? prev : [...prev, newBrand]));
  };

  const handleSave = () => {
    onSave?.({
      name,
      category,
      brand,
      price,
      selectedSizes,
      selectedColors,
      colorStocks,
      imageUrls,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-7 lg:p-8 max-w-[1200px] mx-auto w-full select-none">
      <FormHeader
        name={name}
        category={category}
        brand={brand}
        onBack={onBack}
        onSave={handleSave}
      />

      {/* Main Grid Layout (Left: 7 cols, Right: 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
          <ImageUploader
            imageUrls={imageUrls}
            activeImageIndex={activeImageIndex}
            onImageUrlsChange={setImageUrls}
            onActiveIndexChange={setActiveImageIndex}
          />
          <VariantBuilder
            productType={productType}
            sizeMode={sizeMode}
            selectedSizes={selectedSizes}
            customSizes={customSizes}
            colors={colors}
            selectedColors={selectedColors}
            colorStocks={colorStocks}
            onProductTypeChange={handleProductTypeChange}
            onSizeModeChange={handleSizeModeChange}
            onSelectedSizesChange={setSelectedSizes}
            onCustomSizesChange={setCustomSizes}
            onColorsChange={setColors}
            onSelectedColorsChange={setSelectedColors}
            onColorStocksChange={setColorStocks}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
          <ProductDetails
            name={name}
            category={category}
            brand={brand}
            price={price}
            brandOptions={brandOptions}
            categories={CATEGORIES}
            onNameChange={setName}
            onCategoryChange={setCategory}
            onBrandChange={setBrand}
            onPriceChange={setPrice}
            onAddBrandOption={handleAddBrandOption}
          />
          <ProductSummary
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
          />
        </div>
      </div>
    </div>
  );
}
