import { Product, ProductsResponse } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'basePrice-asc', label: 'Price: Low to High' },
  { value: 'basePrice-desc', label: 'Price: High to Low' },
];
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
    
if (params?.category) queryParams.append('categorySlug', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `${API_BASE_URL}/api/products${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log('📦 Fetching all products from:', url);
    
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status}`);
      return { success: false, data: [], total: 0, page: 1, pages: 1 };
    }

    const data = await response.json();
    console.log(`📦 Retrieved ${data.data?.length || 0} products`);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, data: [], total: 0, page: 1, pages: 1 };
  }
}

// Get single product by slug - search from all products
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    console.log(`🔍 Looking for product with slug: "${slug}"`);
    
    // Decode the slug first (in case it was encoded)
    const decodedSlug = decodeURIComponent(slug);
    console.log(`📝 Decoded slug: "${decodedSlug}"`);
    
    // Fetch all products from your API
    const apiUrl = `${API_BASE_URL}/api/products`;
    console.log(`📡 Fetching products from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      return null;
    }

    const data = await response.json();
    console.log(`📦 API Response structure:`, Object.keys(data));
    
    // Extract products array from response
    let products: Product[] = [];
    if (data.success && Array.isArray(data.data)) {
      products = data.data;
    } else if (Array.isArray(data.data)) {
      products = data.data;
    } else if (Array.isArray(data.products)) {
      products = data.products;
    } else if (Array.isArray(data)) {
      products = data;
    } else {
      console.error('Unexpected API response format:', data);
      return null;
    }
    
    console.log(`📦 Total products in response: ${products.length}`);
    
    // Log first few products to see their structure
    if (products.length > 0) {
      console.log(`📝 Sample product:`, {
        id: products[0]._id,
        name: products[0].name,
        slug: products[0].slug
      });
    }
    
    // Find the product by slug
    const product = products.find(p => p.slug === decodedSlug);
    
    if (product) {
      console.log(`✅ Found product: ${product.name} (ID: ${product._id})`);
      return product;
    }
    
    // If not found by exact slug, try case-insensitive match
    const caseInsensitiveProduct = products.find(
      p => p.slug?.toLowerCase() === decodedSlug.toLowerCase()
    );
    
    if (caseInsensitiveProduct) {
      console.log(`✅ Found product (case-insensitive): ${caseInsensitiveProduct.name}`);
      return caseInsensitiveProduct;
    }
    
    console.log(`❌ No product found with slug: "${decodedSlug}"`);
    console.log(`Available slugs:`, products.slice(0, 10).map(p => p.slug));
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const url = `${API_BASE_URL}/api/products/${id}`;
    console.log(`🔍 Fetching product by ID: ${id}`);
    
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch product: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    let product: Product | null = null;
    if (data.success && data.product) {
      product = data.product;
    } else if (data.product) {
      product = data.product;
    } else if (data.data) {
      product = data.data;
    }
    
    if (product) {
      console.log(`✅ Found product by ID: ${product.name}`);
    }
    
    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

// Smart method that tries multiple strategies
export async function getProductSmart(slugOrId: string): Promise<Product | null> {
  console.log(`🎯 Smart lookup for: "${slugOrId}"`);
  
  // Strategy 1: Try as slug (search in all products)
  console.log('📌 Strategy 1: Looking up by slug...');
  let product = await getProductBySlug(slugOrId);
  if (product) {
    console.log('✅ Found by slug strategy');
    return product;
  }
  
  // Strategy 2: Try as ID (direct API call)
  // Check if it looks like a MongoDB ObjectId (24 hex chars)
  const looksLikeObjectId = /^[a-fA-F0-9]{24}$/.test(slugOrId);
  if (looksLikeObjectId) {
    console.log('📌 Strategy 2: Looking up by ID...');
    product = await getProductById(slugOrId);
    if (product) {
      console.log('✅ Found by ID strategy');
      return product;
    }
  }
  
  console.log('❌ Product not found with any strategy');
  return null;
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