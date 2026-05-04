// // components/products/SortDropdown.tsx
// 'use client';

// import { useState } from 'react';
// import { SORT_OPTIONS } from '@/lib/productService';

// interface SortDropdownProps {
//   sortBy: string;
//   sortOrder: 'asc' | 'desc';
//   onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
//   compact?: boolean;
// }

// export default function SortDropdown({ sortBy, sortOrder, onSortChange, compact = false }: SortDropdownProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const currentSort = SORT_OPTIONS.find(option => {
//     const [optionSortBy, optionSortOrder] = option.value.split('-');
//     return optionSortBy === sortBy && optionSortOrder === sortOrder;
//   }) || SORT_OPTIONS[0];

//   const handleSortSelect = (value: string) => {
//     const [newSortBy, newSortOrder] = value.split('-') as [string, 'asc' | 'desc'];
//     onSortChange(newSortBy, newSortOrder);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-[#f2f2f2] text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-all duration-200 cursor-pointer ${
//           compact ? 'text-sm px-3 py-1' : ''
//         }`}
//       >
//         <span className={compact ? 'text-xs' : ''}>
//           {compact ? 'Sort' : `Sort by: ${currentSort.label}`}
//         </span>
//         <svg 
//           className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 top-full mt-1 w-56 bg-[#f2f2f2] border border-gray-200 rounded-lg shadow-lg z-10">
//           {SORT_OPTIONS.map((option) => (
//             <button
//               key={option.value}
//               onClick={() => handleSortSelect(option.value)}
//               className={`w-full text-left px-4 py-2 hover:bg-gray-200 transition-all duration-200 cursor-pointer ${
//                 option.value === `${sortBy}-${sortOrder}` 
//                   ? 'bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e]' 
//                   : 'text-gray-700 hover:text-gray-900'
//               }`}
//             >
//               {option.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }