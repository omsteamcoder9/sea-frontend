// app/offers/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getOfferProducts } from '@/lib/productService';
import { fetchActiveCategories } from '@/lib/categoryService';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import ProductCard from '@/components/ui/ProductCard';
import FilterDropdown from '@/components/products/FilterDropdown';
import SortDropdown from '@/components/products/SortDropdown';

// Define filter state interface
interface FilterState {
  category: string;
  priceRange: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Loading skeleton
function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-300"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="flex items-center justify-between">
              <div className="h-5 bg-gray-300 rounded w-1/3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: '',
    sortBy: 'discount',
    sortOrder: 'desc'
  });

  // Fetch offer products
  const fetchOfferProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch ALL offer products without any filters
      const response = await getOfferProducts({
        limit: 50
      });
      
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        setError('Failed to load offers');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('An error occurred while loading offers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesData = await fetchActiveCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchOfferProducts();
    fetchCategories();
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    let result = [...products];

    // Apply category filter
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // Apply price range filter
    if (filters.priceRange) {
      result = result.filter(product => {
        const price = product.basePrice;
        switch (filters.priceRange) {
          case '100-200':
            return price >= 100 && price <= 200;
          case '200-300':
            return price >= 200 && price <= 300;
          case '300-400':
            return price >= 300 && price <= 400;
          case '400-500':
            return price >= 400 && price <= 500;
          case '500-600':
            return price >= 500 && price <= 600;
          case 'above-600':
            return price > 600;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'price':
          aValue = a.basePrice;
          bValue = b.basePrice;
          break;
        case 'discount':
          aValue = a.discountPercentage || 0;
          bValue = b.discountPercentage || 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(result);
  }, [filters, products]);

  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [filters, products, applyFilters]);

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      sortBy: 'discount',
      sortOrder: 'desc'
    });
  };

  // Calculate statistics
  const totalProducts = filteredProducts.length;
  const productsWithOffers = products.filter(p => 
    p.hasOffer || p.discountPercentage || (p.variants && p.variants.some(v => v.discountPercentage))
  ).length;

  // Count active filters
  const activeFilterCount = [
    filters.category ? 1 : 0,
    filters.priceRange ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">

        {/* Loading State */}
        {loading && (
          <>
            <div className="mb-6">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <ProductSkeleton />
          </>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
            <button
              onClick={fetchOfferProducts}
              className="bg-gradient-to-r from-[#1f8aa8] to-[#36a3c7] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            

            {/* No Results */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-5xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No offers available</h3>
                <p className="text-gray-500 mb-6">
                  Currently, there are no products on special offer. Please check back later!
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-gradient-to-r from-[#1f8aa8] to-[#36a3c7] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              /* Products Grid - USING ProductCard COMPONENT */
<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}