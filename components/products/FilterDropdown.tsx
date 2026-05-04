// // components/products/FilterDropdown.tsx
// 'use client';

// import { useState, useRef, useEffect } from 'react';

// interface FilterOption<T> {
//   value: T;
//   label: string;
// }

// interface FilterDropdownProps<T> {
//   title: string;
//   value: T | T[];
//   options: FilterOption<T>[];
//   onSelect: (value: T | T[]) => void;
//   multiSelect?: boolean;
//   compact?: boolean;
// }

// export default function FilterDropdown<T>({ 
//   title, 
//   value, 
//   options, 
//   onSelect, 
//   multiSelect = false,
//   compact = false 
// }: FilterDropdownProps<T>) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Get display label for current selection
//   const getDisplayLabel = () => {
//     if (multiSelect && Array.isArray(value) && value.length > 0) {
//       const selectedLabels = options
//         .filter(opt => value.includes(opt.value))
//         .map(opt => opt.label);
      
//       if (selectedLabels.length === 1) return selectedLabels[0];
//       if (selectedLabels.length > 1) return `${selectedLabels.length} selected`;
//     } else if (!multiSelect) {
//       const selectedOption = options.find(opt => {
//         // Handle different comparison cases
//         if (value === undefined || value === null) return false;
//         if (typeof value === 'string' && value.trim() === '') return false;
//         if (typeof value === 'boolean' && value === false) return false;
//         return opt.value === value;
//       });
//       if (selectedOption) {
//         return selectedOption.label;
//       }
//     }
//     return compact ? title : title;
//   };

//   const handleSelect = (optionValue: T) => {
//     if (multiSelect) {
//       const currentValues = Array.isArray(value) ? value : [];
//       const newValues = currentValues.includes(optionValue)
//         ? currentValues.filter(v => v !== optionValue)
//         : [...currentValues, optionValue];
//       onSelect(newValues);
//     } else {
//       onSelect(optionValue);
//       setIsOpen(false);
//     }
//   };

//   const isActive = multiSelect 
//     ? Array.isArray(value) && value.length > 0
//     : value !== '' && value !== false && value !== undefined && value !== null;

//   const displayLabel = getDisplayLabel();

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
//           compact ? 'px-2 py-1 text-xs' : ''
//         } ${
//           isActive
//             ? 'bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white border-transparent shadow-lg hover:shadow-[#D97A22]/25'
//             : 'bg-[#f2f2f2] text-gray-700 border-gray-300 hover:border-gray-500 hover:text-gray-900'
//         }`}
//       >
//         <span className={`max-w-[120px] truncate ${compact ? 'max-w-[80px]' : ''}`}>
//           {displayLabel}
//         </span>
//         <svg 
//           className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''} ${
//             compact ? 'w-3 h-3' : ''
//           }`} 
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute top-full left-0 mt-1 w-48 bg-[#f2f2f2] border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
//           {options.map((option, index) => {
//             const isSelected = multiSelect
//               ? Array.isArray(value) && value.includes(option.value)
//               : value === option.value;

//             return (
//               <button
//                 key={index}
//                 onClick={() => handleSelect(option.value)}
//                 className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-200 transition-all duration-200 ${
//                   isSelected
//                     ? 'bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e]'
//                     : 'text-gray-700 hover:text-gray-900'
//                 }`}
//               >
//                 {option.label}
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }