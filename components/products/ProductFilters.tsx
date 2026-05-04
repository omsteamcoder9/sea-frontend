// // components/products/ProductFilters.tsx
// 'use client';

// import { useState } from 'react';
// import { Category } from '@/types/category';
// import { PRICE_RANGES } from '@/lib/productService';

// interface ProductFiltersProps {
//   categories: Category[];
//   filters: {
//     category?: string;
//     priceRange?: string;
//     featured?: boolean;
//     sortBy?: string;
//     sortOrder?: string;
//   };
//   onFiltersChange: (filters: {
//     category?: string;
//     priceRange?: string;
//     featured?: boolean;
//     sortBy?: string;
//     sortOrder?: string;
//   }) => void;
// }

// export default function ProductFilters({ categories, filters, onFiltersChange }: ProductFiltersProps) {
//   const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

//   const handleFilterChange = (key: keyof typeof filters, value: string | boolean) => {
//     onFiltersChange({
//       ...filters,
//       [key]: value
//     });
//   };

//   const clearAllFilters = () => {
//     onFiltersChange({
//       category: '',
//       priceRange: '',
//       featured: false,
//       sortBy: 'createdAt',
//       sortOrder: 'desc'
//     });
//   };

//   return (
//     <>
//       {/* Mobile Filter Button */}
//       <div className="lg:hidden mb-4">
//         <button
//           onClick={() => setIsMobileFiltersOpen(true)}
//           className="w-full py-3 bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-[#D97A22]/25 transition-all duration-200 cursor-pointer"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
//           </svg>
//           Filters
//         </button>
//       </div>

//       {/* Mobile Filter Overlay */}
//       {isMobileFiltersOpen && (
//         <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
//           <div className="absolute right-0 top-0 h-full w-80 bg-[#f2f2f2] p-6 overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//               <button
//                 onClick={() => setIsMobileFiltersOpen(false)}
//                 className="p-2 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <div className="space-y-6">
//               {/* Categories */}
//               <div>
//                 <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
//                 <div className="space-y-2">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="category"
//                       checked={!filters.category}
//                       onChange={() => handleFilterChange('category', '')}
//                       className="text-[#D97A22] focus:ring-[#D97A22]"
//                     />
//                     <span className="ml-2 text-gray-700">All Categories</span>
//                   </label>
//                   {categories.map((category) => (
//                     <label key={category._id} className="flex items-center cursor-pointer">
//                       <input
//                         type="radio"
//                         name="category"
//                         checked={filters.category === category._id}
//                         onChange={() => handleFilterChange('category', category._id)}
//                         className="text-[#D97A22] focus:ring-[#D97A22]"
//                       />
//                       <span className="ml-2 text-gray-700">{category.name}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div>
//                 <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
//                 <div className="space-y-2">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="priceRange"
//                       checked={!filters.priceRange}
//                       onChange={() => handleFilterChange('priceRange', '')}
//                       className="text-[#D97A22] focus:ring-[#D97A22]"
//                     />
//                     <span className="ml-2 text-gray-700">All Prices</span>
//                   </label>
//                   {PRICE_RANGES.map((range) => (
//                     <label key={range.value} className="flex items-center cursor-pointer">
//                       <input
//                         type="radio"
//                         name="priceRange"
//                         checked={filters.priceRange === range.value}
//                         onChange={() => handleFilterChange('priceRange', range.value)}
//                         className="text-[#D97A22] focus:ring-[#D97A22]"
//                       />
//                       <span className="ml-2 text-gray-700">{range.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Featured */}
//               <div>
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={filters.featured || false}
//                     onChange={(e) => handleFilterChange('featured', e.target.checked)}
//                     className="text-[#D97A22] focus:ring-[#D97A22]"
//                   />
//                   <span className="ml-2 text-gray-700 font-semibold">Featured Products Only</span>
//                 </label>
//               </div>

//               {/* Clear Filters */}
//               <button
//                 onClick={clearAllFilters}
//                 className="w-full py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:border-gray-500 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//               >
//                 Clear All Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Desktop Filters */}
//       <div className="hidden lg:block bg-[#f2f2f2] p-6 rounded-lg border border-gray-200 sticky top-4">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//           <button
//             onClick={clearAllFilters}
//             className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
//           >
//             Clear
//           </button>
//         </div>
//         <div className="space-y-6">
//           {/* Categories */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
//             <div className="space-y-2">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   name="category"
//                   checked={!filters.category}
//                   onChange={() => handleFilterChange('category', '')}
//                   className="text-[#D97A22] focus:ring-[#D97A22]"
//                 />
//                 <span className="ml-2 text-gray-700">All Categories</span>
//               </label>
//               {categories.map((category) => (
//                 <label key={category._id} className="flex items-center cursor-pointer">
//                   <input
//                     type="radio"
//                     name="category"
//                     checked={filters.category === category._id}
//                     onChange={() => handleFilterChange('category', category._id)}
//                     className="text-[#D97A22] focus:ring-[#D97A22]"
//                   />
//                   <span className="ml-2 text-gray-700">{category.name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Price Range */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
//             <div className="space-y-2">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   name="priceRange"
//                   checked={!filters.priceRange}
//                   onChange={() => handleFilterChange('priceRange', '')}
//                   className="text-[#D97A22] focus:ring-[#D97A22]"
//                 />
//                 <span className="ml-2 text-gray-700">All Prices</span>
//               </label>
//               {PRICE_RANGES.map((range) => (
//                 <label key={range.value} className="flex items-center cursor-pointer">
//                   <input
//                     type="radio"
//                     name="priceRange"
//                     checked={filters.priceRange === range.value}
//                     onChange={() => handleFilterChange('priceRange', range.value)}
//                     className="text-[#D97A22] focus:ring-[#D97A22]"
//                   />
//                   <span className="ml-2 text-gray-700">{range.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Featured */}
//           <div>
//             <label className="flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={filters.featured || false}
//                 onChange={(e) => handleFilterChange('featured', e.target.checked)}
//                 className="text-[#D97A22] focus:ring-[#D97A22]"
//               />
//               <span className="ml-2 text-gray-700 font-semibold">Featured Products Only</span>
//             </label>
//           </div>

//           {/* Clear Filters */}
//           <button
//             onClick={clearAllFilters}
//             className="w-full py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:border-gray-500 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//           >
//             Clear All Filters
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }