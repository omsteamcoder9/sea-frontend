// components/products/SortDropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { SORT_OPTIONS } from '@/lib/productService';

interface SortDropdownProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  compact?: boolean;
}

export default function SortDropdown({ sortBy, sortOrder, onSortChange, compact = false }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSort = SORT_OPTIONS.find(option => {
    const [optionSortBy, optionSortOrder] = option.value.split('-');
    return optionSortBy === sortBy && optionSortOrder === sortOrder;
  }) || SORT_OPTIONS[0];

  const handleSortSelect = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as [string, 'asc' | 'desc'];
    onSortChange(newSortBy, newSortOrder);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 border border-[#B8DCE7] rounded-md bg-[#F8FCFD] text-[#315A6E] hover:border-[#008FB8] hover:text-[#008FB8] transition-all duration-200 cursor-pointer
          ${compact ? 'px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs' : 'px-4 py-2 text-sm'}
        `}
      >
        <span className="whitespace-nowrap">
          <span className="sm:hidden">
            {currentSort.label}
          </span>
          <span className="hidden sm:inline">
            Sort: {currentSort.label}
          </span>
        </span>
        <svg
          className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''} ${compact ? 'w-3 h-3' : 'w-4 h-4'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-1 bg-[#F8FCFD] border border-[#B8DCE7] rounded-lg shadow-lg z-20 overflow-hidden
          ${compact ? 'w-44 sm:w-56' : 'w-56'}
        `}>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className={`w-full text-left transition-all duration-200 cursor-pointer
                ${compact ? 'px-3 py-1.5 text-[11px] sm:text-xs' : 'px-4 py-2 text-sm'}
                ${option.value === `${sortBy}-${sortOrder}`
                  ? 'bg-[#008FB8] text-white hover:bg-[#064B6A]'
                  : 'text-[#315A6E] hover:bg-[#EAF8FC] hover:text-[#008FB8]'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}