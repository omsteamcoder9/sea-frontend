'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchActiveCategories } from '@/lib/categoryService';
import { Category } from '@/types/category';
import HeaderClient from './HeaderClient';

interface HeaderWrapperProps {
  initialCategories?: Category[];
}

export default function HeaderWrapper({ initialCategories = [] }: HeaderWrapperProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(!initialCategories.length);
  const hasFetched = useRef(false); // Add this to prevent multiple fetches

  useEffect(() => {
    // Only fetch if:
    // 1. No initial categories provided
    // 2. We haven't fetched before
    if (initialCategories.length === 0 && !hasFetched.current) {
      hasFetched.current = true; // Mark as fetched immediately
      
      const loadCategories = async () => {
        try {
          setLoading(true);
          const data = await fetchActiveCategories();
          setCategories(data);
        } catch (error) {
          console.error('Error fetching active categories:', error);
        } finally {
          setLoading(false);
        }
      };

      loadCategories();
    }
  }, [initialCategories]); // Keep dependency, but useRef prevents re-fetching

  if (loading) {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return <HeaderClient categories={categories} />;
}