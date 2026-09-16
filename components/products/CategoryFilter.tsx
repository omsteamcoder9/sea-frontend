// components/products/CategoryFilter.tsx
'use client';

import { Category } from '@/types/category';
import Link from 'next/link';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-[#063B5C] mb-4">Filter by Category:</h3>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
            !selectedCategory
              ? 'bg-gradient-to-r from-[#008FB8] via-[#008FB8] to-[#008FB8] text-white shadow-lg hover:shadow-[#008FB8]/25'
              : 'bg-[#F8FCFD] text-[#315A6E] hover:bg-[#EAF8FC] hover:text-[#008FB8] hover:shadow-md border border-[#B8DCE7]'
          }`}
        >
          All Products
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category._id}`}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
              selectedCategory === category._id
                ? 'bg-gradient-to-r from-[#008FB8] via-[#008FB8] to-[#008FB8] text-white shadow-lg hover:shadow-[#008FB8]/25'
                : 'bg-[#F8FCFD] text-[#315A6E] hover:bg-[#EAF8FC] hover:text-[#008FB8] hover:shadow-md border border-[#B8DCE7]'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}