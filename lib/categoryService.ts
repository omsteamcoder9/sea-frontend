// lib/categoryService.ts
import { Category, CategoryResponse, SingleCategoryResponse, CreateCategoryData, UpdateCategoryData } from '@/types/category';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get all categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data: CategoryResponse = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get single category by ID
export async function fetchCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status}`);
    }

    const data: SingleCategoryResponse = await response.json();
    return data.success ? data.category : null;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    return null;
  }
}

// Create category (Admin only) - with image support
export async function createCategory(data: CreateCategoryData, token: string): Promise<Category | null> {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }

    const result = await response.json();
    return result.category;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
}

// Update category (Admin only) - with image support
export async function updateCategory(id: string, data: UpdateCategoryData, token: string): Promise<Category | null> {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    if (data.deleteImage) {
      formData.append('deleteImage', 'true');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update category');
    }

    const result = await response.json();
    return result.category;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
}

// Delete category (Admin only)
export async function deleteCategory(id: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete category');
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

// Get active categories (only status: 'active')
export async function fetchActiveCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data: CategoryResponse = await response.json();
    const categories = data.categories || [];
    
    // Filter active categories
    return categories.filter(cat => cat.status !== 'inactive');
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return [];
  }
}
// Add this function
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories?slug=${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const categories = data.categories || [];
    return categories.find((cat: Category) => cat.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}