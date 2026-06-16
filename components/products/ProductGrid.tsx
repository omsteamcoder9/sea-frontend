'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Product } from '@/types/product';
import { getAllProducts } from '@/lib/productService';
import ProductCard from '../ui/ProductCard';

interface ProductGridProps {
  category?: string;
  search?: string;
  limit?: number;
  hideFilters?: boolean;
}

interface QueryParams {
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export default function ProductGrid({ category, search, limit, hideFilters = false }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isInitialMount = useRef(true);
  
  // Determine if this is the home page
  const isHomePage = hideFilters && limit === undefined;
  
  // Filter state
  const [filters, setFilters] = useState({
    category: category || '',
    search: search || '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  // Load filtered products
  const loadFilteredProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const queryParams: QueryParams = {};
      
      if (filters.category) queryParams.category = filters.category;
      if (filters.search) queryParams.search = filters.search;
      if (filters.sortBy) queryParams.sortBy = filters.sortBy;
      if (filters.sortOrder) queryParams.sortOrder = filters.sortOrder;
      
      const response = await getAllProducts(queryParams);
      let productsData = response.data || [];

      // Apply limit
      const finalLimit = isHomePage ? 8 : limit;
      if (finalLimit && productsData.length) {
        productsData = productsData.slice(0, finalLimit);
      }

      setProducts(productsData);
      setError('');
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, limit, isHomePage]);

  // Load initial data
  useEffect(() => {
    loadFilteredProducts();
  }, []);

  // Update filters when category prop changes
  useEffect(() => {
    if (category !== undefined && category !== filters.category) {
      setFilters(prev => ({
        ...prev,
        category: category || ''
      }));
    }
  }, [category, filters.category]);

  // Update filters when search prop changes
  useEffect(() => {
    if (search !== undefined && search !== filters.search) {
      setFilters(prev => ({
        ...prev,
        search: search || ''
      }));
    }
  }, [search, filters.search]);

  // Reload products when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    loadFilteredProducts();
  }, [filters, loadFilteredProducts]);

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12 font-sans">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2" style={{ borderBottomColor: '#9B0F06' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 sm:py-12 px-4 font-sans">
        <p className="text-red-600 text-base sm:text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 sm:mt-4 text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 text-sm sm:text-base font-medium cursor-pointer"
          style={{ backgroundColor: '#9B0F06' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="mx-2 xs:mx-4 sm:mx-6 md:mx-8 lg:mx-8 xl:mx-12 2xl:mx-16">
        {/* Products Grid */}
        {products.length === 0 && !loading ? (
          <div className="text-center py-8 sm:py-12 font-sans">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                No products available in this category.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}