// lib/api.ts
import { Product } from '@/types/product';
import { Category } from '@/types/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define a type for API errors
interface APIError extends Error {
  status?: number;
  details?: unknown;
}

// Define params interfaces
interface GetAllProductsParams {
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

interface GetByCategoryParams {
  page?: number;
  limit?: number;
  sort?: string;
}

interface GetAllCategoriesParams {
  includeInactive?: boolean;
  includeProductsCount?: boolean;
}

// Enhanced fetch wrapper with detailed error handling
async function fetchAPI<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Clone response to read body for error details
    const responseClone = response.clone();
    
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      let errorDetails: unknown = null;
      
      try {
        // Try to get error details from response body
        const errorData = await responseClone.json();
        errorDetails = errorData;
        
        if (errorData && typeof errorData === 'object') {
          if ('message' in errorData && typeof errorData.message === 'string') {
            errorMessage = `API Error: ${response.status} - ${errorData.message}`;
          } else if ('error' in errorData && typeof errorData.error === 'string') {
            errorMessage = `API Error: ${response.status} - ${errorData.error}`;
          }
        }
      } catch {
        // If response is not JSON, try to get text
        try {
          const errorText = await responseClone.text();
          if (errorText) {
            errorMessage = `API Error: ${response.status} - ${errorText}`;
          }
        } catch {
          // Use default error message
        }
      }
      
      const error: APIError = new Error(errorMessage);
      error.status = response.status;
      error.details = errorDetails;
      throw error;
    }
    
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`API Fetch Error for ${endpoint}:`, error);
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Network error: ${String(error)}`);
    }
  }
}

// Product API functions
export const productAPI = {
  // Get all products with optional filtering
  getAll: async (params?: GetAllProductsParams): Promise<{ success: boolean; data: Product[]; count: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI<{ success: boolean; data: Product[]; count: number }>(endpoint);
  },

  // Get product by ID
  getById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    return fetchAPI<{ success: boolean; data: Product }>(`/products/${id}`);
  },

  // Get product by slug with fallback
  getBySlug: async (slug: string): Promise<{ success: boolean; data: Product }> => {
    try {
      return await fetchAPI<{ success: boolean; data: Product }>(`/products/slug/${slug}`);
    } catch (error: unknown) {
      // If slug endpoint fails, try to find by slug from all products
      const apiError = error as APIError;
      if (apiError.status === 404 || apiError.status === 500) {
        console.warn(`Slug endpoint failed, trying search fallback for slug: ${slug}`);
        const allProducts = await fetchAPI<{ success: boolean; data: Product[]; count: number }>('/products');
        const product = allProducts.data.find((p: Product) => p.slug === slug);
        
        if (product) {
          return { success: true, data: product };
        }
      }
      throw error;
    }
  },

  // Get products by category
  getByCategory: async (categoryId: string, params?: GetByCategoryParams): Promise<{ 
    success: boolean; 
    data: {
      category: Category;
      products: Product[];
      pagination: {
        current: number;
        pages: number;
        total: number;
      }
    }
  }> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/categories/${categoryId}/products${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI<{ 
      success: boolean; 
      data: {
        category: Category;
        products: Product[];
        pagination: {
          current: number;
          pages: number;
          total: number;
        }
      }
    }>(endpoint);
  },
};

// Category API functions
export const categoryAPI = {
  // Get all categories
  getAll: async (params?: GetAllCategoriesParams): Promise<{ success: boolean; data: Category[]; count: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI<{ success: boolean; data: Category[]; count: number }>(endpoint);
  },

  // Get category by ID or slug
  getById: async (id: string): Promise<{ success: boolean; data: Category }> => {
    return fetchAPI<{ success: boolean; data: Category }>(`/categories/${id}`);
  },

  // Get categories tree
  getTree: async (): Promise<{ success: boolean; data: Category[] }> => {
    return fetchAPI<{ success: boolean; data: Category[] }>('/categories/tree');
  },

  // Get active categories only
  getActive: async (): Promise<{ success: boolean; data: Category[]; count: number }> => {
    return fetchAPI<{ success: boolean; data: Category[]; count: number }>('/categories/active');
  },
};

// Legacy functions for backward compatibility
export async function fetchProducts(category?: string): Promise<Product[]> {
  try {
    const data = await productAPI.getAll(category ? { category } : {});
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await categoryAPI.getAll();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchActiveCategories(): Promise<Category[]> {
  try {
    const data = await categoryAPI.getActive();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return [];
  }
}

// Export individual functions for backward compatibility
export const getProductBySlug = productAPI.getBySlug;
export const getProductById = productAPI.getById;
export const getAllProducts = productAPI.getAll;
export const getCategoryProducts = productAPI.getByCategory;
export const getAllCategories = categoryAPI.getAll;