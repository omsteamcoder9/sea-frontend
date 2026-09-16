// components/products/ProductFilters.tsx
'use client';

import { useState } from 'react';
import { Category } from '@/types/category';
import { PRICE_RANGES } from '@/lib/productService';

interface ProductFiltersProps {
  categories: Category[];
  filters: {
    category?: string;
    priceRange?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: string;
  };
  onFiltersChange: (filters: {
    category?: string;
    priceRange?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) => void;
}

export default function ProductFilters({ categories, filters, onFiltersChange }: ProductFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterChange = (key: keyof typeof filters, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  // Mobile-only: apply filter and close overlay so user sees the grid update
  const handleMobileFilterChange = (key: keyof typeof filters, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
    setIsMobileFiltersOpen(false);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      priceRange: '',
      featured: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setIsMobileFiltersOpen(false);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full py-3 bg-gradient-to-r from-[#064B6A] via-[#064B6A] to-[#064B6A] text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-[#008FB8]/25 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-[#F8FCFD] p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#063B5C]">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-[#EAF8FC] rounded-lg transition-all duration-200 cursor-pointer"
              >
                <svg className="w-6 h-6 text-[#315A6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-[#063B5C] mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="mobile-category"
                      checked={!filters.category}
                      onChange={() => handleMobileFilterChange('category', '')}
                      className="text-[#008FB8] focus:ring-[#008FB8]"
                    />
                    <span className="ml-2 text-[#315A6E]">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-category"
                        checked={filters.category === (category.slug || category._id)}
                        onChange={() => handleMobileFilterChange('category', category.slug || category._id)}
                        className="text-[#008FB8] focus:ring-[#008FB8]"
                      />
                      <span className="ml-2 text-[#315A6E]">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-[#063B5C] mb-3">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="mobile-priceRange"
                      checked={!filters.priceRange}
                      onChange={() => handleMobileFilterChange('priceRange', '')}
                      className="text-[#008FB8] focus:ring-[#008FB8]"
                    />
                    <span className="ml-2 text-[#315A6E]">All Prices</span>
                  </label>
                  {PRICE_RANGES.map((range) => (
                    <label key={range.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-priceRange"
                        checked={filters.priceRange === range.value}
                        onChange={() => handleMobileFilterChange('priceRange', range.value)}
                        className="text-[#008FB8] focus:ring-[#008FB8]"
                      />
                      <span className="ml-2 text-[#315A6E]">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                className="w-full py-2 text-sm text-[#315A6E] border border-[#B8DCE7] rounded-lg hover:border-[#008FB8] hover:text-[#008FB8] transition-all duration-200 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-[#F8FCFD] p-6 rounded-lg border border-[#B8DCE7] sticky top-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#063B5C]">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-sm text-[#315A6E] hover:text-[#008FB8] transition-colors duration-200 cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-[#063B5C] mb-3">Categories</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="desktop-category"
                  checked={!filters.category}
                  onChange={() => handleFilterChange('category', '')}
                  className="text-[#008FB8] focus:ring-[#008FB8]"
                />
                <span className="ml-2 text-[#315A6E]">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category._id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="desktop-category"
                    checked={filters.category === (category.slug || category._id)}
                    onChange={() => handleFilterChange('category', category.slug || category._id)}
                    className="text-[#008FB8] focus:ring-[#008FB8]"
                  />
                  <span className="ml-2 text-[#315A6E]">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-[#063B5C] mb-3">Price Range</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="desktop-priceRange"
                  checked={!filters.priceRange}
                  onChange={() => handleFilterChange('priceRange', '')}
                  className="text-[#008FB8] focus:ring-[#008FB8]"
                />
                <span className="ml-2 text-[#315A6E]">All Prices</span>
              </label>
              {PRICE_RANGES.map((range) => (
                <label key={range.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="desktop-priceRange"
                    checked={filters.priceRange === range.value}
                    onChange={() => handleFilterChange('priceRange', range.value)}
                    className="text-[#008FB8] focus:ring-[#008FB8]"
                  />
                  <span className="ml-2 text-[#315A6E]">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearAllFilters}
            className="w-full py-2 text-sm text-[#315A6E] border border-[#B8DCE7] rounded-lg hover:border-[#008FB8] hover:text-[#008FB8] transition-all duration-200 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
}