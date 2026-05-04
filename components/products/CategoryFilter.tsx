// // components/products/CategoryFilter.tsx
// 'use client';

// import { Category } from '@/types/category';
// import Link from 'next/link';

// interface CategoryFilterProps {
//   categories: Category[];
//   selectedCategory?: string;
// }

// export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
//   return (
//     <div className="mb-8">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category:</h3>
//       <div className="flex flex-wrap gap-2">
//         <Link
//           href="/products"
//           className={`px-4 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
//             !selectedCategory
//               ? 'bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white shadow-lg hover:shadow-[#D97A22]/25'
//               : 'bg-[#f2f2f2] text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:shadow-md border border-gray-300'
//           }`}
//         >
//           All Products
//         </Link>
        
//         {categories.map((category) => (
//           <Link
//             key={category._id}
//             href={`/products?category=${category._id}`}
//             className={`px-4 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
//               selectedCategory === category._id
//                 ? 'bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white shadow-lg hover:shadow-[#D97A22]/25'
//                 : 'bg-[#f2f2f2] text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:shadow-md border border-gray-300'
//             }`}
//           >
//             {category.name}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }