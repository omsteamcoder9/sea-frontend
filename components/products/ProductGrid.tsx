'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import { getAllProducts } from '@/lib/productService';
import ProductCard from '../ui/ProductCard';
import ProductFilters from './ProductFilters';
import SortDropdown from './SortDropdown';
import { Category } from '@/types/category';
import { fetchActiveCategories } from '@/lib/categoryService';

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
  minPrice?: number;
  maxPrice?: number;
}

export default function ProductGrid({ category, search, limit, hideFilters = false }: ProductGridProps) {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isInitialMount = useRef(true);

  const isHomePage = hideFilters && limit === undefined;

  const [filters, setFilters] = useState({
    category: category || '',
    search: search || '',
    priceRange: '',
    featured: false,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchActiveCategories();
        setCategories(data as Category[]);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    if (!hideFilters) {
      loadCategories();
    }
  }, [hideFilters]);

  // ✅ FIX: Sync `category` and `search` props into filters whenever they change.
  // This makes header category clicks work even when already on /products.
  useEffect(() => {
    setFilters(prev => {
      const newCategory = category || '';
      const newSearch = search || '';
      if (prev.category === newCategory && prev.search === newSearch) {
        return prev; // no change → avoid re-render loop
      }
      return {
        ...prev,
        category: newCategory,
        search: newSearch,
      };
    });
  }, [category, search]);

  const parsePriceRange = (range: string): { minPrice?: number; maxPrice?: number } => {
    if (!range) return {};
    if (range === 'above-600') return { minPrice: 600 };
    const parts = range.split('-');
    if (parts.length === 2) {
      const min = Number(parts[0]);
      const max = Number(parts[1]);
      if (!isNaN(min) && !isNaN(max)) {
        return { minPrice: min, maxPrice: max };
      }
    }
    return {};
  };

  const loadFilteredProducts = useCallback(async () => {
    try {
      setLoading(true);

      const queryParams: QueryParams = {};
      if (filters.category) queryParams.category = filters.category;
      if (filters.search) queryParams.search = filters.search;
      if (filters.sortBy) queryParams.sortBy = filters.sortBy;
      if (filters.sortOrder) queryParams.sortOrder = filters.sortOrder;

      const priceParams = parsePriceRange(filters.priceRange);
      if (priceParams.minPrice !== undefined) queryParams.minPrice = priceParams.minPrice;
      if (priceParams.maxPrice !== undefined) queryParams.maxPrice = priceParams.maxPrice;

      const response = await getAllProducts(queryParams);
      let productsData = response.data || [];

      if (filters.priceRange) {
        const { minPrice, maxPrice } = parsePriceRange(filters.priceRange);
        productsData = productsData.filter((p: any) => {
          const price = p.basePrice || p.price || 0;
          if (minPrice !== undefined && price < minPrice) return false;
          if (maxPrice !== undefined && price > maxPrice) return false;
          return true;
        });
      }

      if (filters.featured) {
        productsData = productsData.filter((p: any) => p.featured === true);
      }

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

  useEffect(() => {
    loadFilteredProducts();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    loadFilteredProducts();
  }, [filters, loadFilteredProducts]);

  const handleFiltersChange = (newFilters: {
    category?: string;
    priceRange?: string;
    featured?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    setFilters(prev => ({
      ...prev,
      category: newFilters.category ?? prev.category,
      priceRange: newFilters.priceRange ?? prev.priceRange,
      featured: newFilters.featured ?? prev.featured,
      sortBy: newFilters.sortBy ?? prev.sortBy,
      sortOrder: (newFilters.sortOrder as 'asc' | 'desc') ?? prev.sortOrder,
    }));

    if (newFilters.category !== undefined) {
      const params = new URLSearchParams(searchParams.toString());
      if (newFilters.category) {
        params.set('category', newFilters.category);
      } else {
        params.delete('category');
      }
      const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12 font-sans">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2" style={{ borderBottomColor: '#008FB8' }}></div>
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
          style={{ backgroundColor: '#064B6A' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // HOME — no filters
  if (hideFilters) {
    return (
      <div className="font-sans">
        <div className="mx-2 xs:mx-4 sm:mx-6 md:mx-8 lg:mx-8 xl:mx-12 2xl:mx-16">
          {products.length === 0 && !loading ? (
            <div className="text-center py-8 sm:py-12 font-sans">
              <div className="bg-white rounded-lg shadow-sm border border-[#B8DCE7] p-6 max-w-md mx-auto">
                <svg className="w-16 h-16 text-[#315A6E]/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-semibold text-[#063B5C] mb-2">No Products Found</h3>
                <p className="text-[#315A6E] mb-4 text-sm">No products available in this category.</p>
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

  // PRODUCTS PAGE — with filters
  return (
    <div className="font-sans">
      <div className="mx-2 xs:mx-4 sm:mx-6 md:mx-8 lg:mx-8 xl:mx-12 2xl:mx-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          <aside className="lg:col-span-1">
            <ProductFilters
              categories={categories}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          <div className="lg:col-span-3">
            {/* Sort bar — one line on mobile, unchanged on desktop */}
            <div className="flex justify-between items-center gap-2 mb-3 sm:mb-4">
              <p className="text-[11px] sm:text-sm text-[#315A6E] whitespace-nowrap">
                {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
              <SortDropdown
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={handleSortChange}
                compact
              />
            </div>

            {products.length === 0 && !loading ? (
              <div className="text-center py-8 sm:py-12 font-sans">
                <div className="bg-white rounded-lg shadow-sm border border-[#B8DCE7] p-6 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-[#315A6E]/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-lg font-semibold text-[#063B5C] mb-2">No Products Found</h3>
                  <p className="text-[#315A6E] mb-4 text-sm">No products match your filters.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}