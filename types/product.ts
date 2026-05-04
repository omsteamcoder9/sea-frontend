// types/product.ts
export interface ProductVariant {
  _id?: string;
  name: string;
  variantName?: string;  // For backward compatibility
  variantSlug?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  isDefault?: boolean;
  stock: number;
  sku: string;
  images?: Array<{
    image: string;
  }>;
  description?: string;
  weight?: number;
  weightUnit?: string;
  status?: string;
  features?: string[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  hasOffer?: boolean;
  discountPercentage?: number;
  stock: number;
  category: string | Category;
  images?: Array<{
    image: string;
    isMain?: boolean;
  }>;
  variants?: ProductVariant[];  // ✅ Changed to use ProductVariant type
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total?: number;
  page?: number;
  pages?: number;
  message?: string;
}

export interface ProductResponse {
  success: boolean;
  product: Product;
  message?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}