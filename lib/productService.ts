import { Product, ProductsResponse } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const PRICE_RANGES = [
  { value: '100-200', label: '₹100 - ₹200' },
  { value: '200-300', label: '₹200 - ₹300' },
  { value: '300-400', label: '₹300 - ₹400' },
  { value: '400-500', label: '₹400 - ₹500' },
  { value: '500-600', label: '₹500 - ₹600' },
  { value: 'above-600', label: 'Above ₹600' }
];

interface GetProductsParams {
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  image: string | null;
  category: string;
  featured: boolean;
}

// Get all products with filters
export async function getAllProducts(params?: GetProductsParams): Promise<ProductsResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `${API_BASE_URL}/api/products${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, data: [], total: 0, page: 1, pages: 1 };
  }
}

// Get single product by slug or ID
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${slug}`, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.product : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Create product (Admin only)
export async function createProduct(productData: FormData, token: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

// Update product (Admin only)
export async function updateProduct(id: string, productData: FormData, token: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

// Delete product (Admin only)
export async function deleteProduct(id: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete product');
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Quick search products (for header search)
export async function quickSearchProducts(query: string, limit: number = 5): Promise<{ success: boolean; data: SearchProduct[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/quick-search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error('Error searching products:', error);
    return { success: false, data: [] };
  }
}