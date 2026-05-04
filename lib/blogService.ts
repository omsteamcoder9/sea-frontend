// lib/blogService.ts

import { 
  Blog, 
  BlogFormData, 
  BlogResponse, 
  BlogsListResponse, 
  CategoriesResponse, 
  TagsResponse, 
  PaginationParams, 
  LikeResponse 
} from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class BlogService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  private getMultipartHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      // Let browser set Content-Type for FormData
    };
  }

  // Create blog post
  async createBlog(formData: BlogFormData): Promise<BlogResponse> {
    try {
      const form = new FormData();
      
      // Append text fields
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('content', formData.content);
      if (formData.category) form.append('category', formData.category);
      form.append('status', formData.status);
      
      // Handle tags
      if (Array.isArray(formData.tags)) {
        form.append('tags', formData.tags.join(','));
      } else {
        form.append('tags', formData.tags);
      }
      
      // Append optional fields
      if (formData.imageAlt) form.append('imageAlt', formData.imageAlt);
      if (formData.excerpt) form.append('excerpt', formData.excerpt);
      if (formData.metaTitle) form.append('metaTitle', formData.metaTitle);
      if (formData.metaDescription) form.append('metaDescription', formData.metaDescription);
      
      // Handle metaKeywords
      if (formData.metaKeywords) {
        if (Array.isArray(formData.metaKeywords)) {
          form.append('metaKeywords', formData.metaKeywords.join(','));
        } else {
          form.append('metaKeywords', formData.metaKeywords);
        }
      }
      
      if (formData.canonicalUrl) form.append('canonicalUrl', formData.canonicalUrl);
      if (formData.ogTitle) form.append('ogTitle', formData.ogTitle);
      if (formData.ogDescription) form.append('ogDescription', formData.ogDescription);
      
      // Append files
      if (formData.image) {
        form.append('image', formData.image);
      }
      if (formData.ogImage) {
        form.append('ogImage', formData.ogImage);
      }

      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: this.getMultipartHeaders(),
        body: form,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create blog');
      }

      return data;
    } catch (error) {
      console.error('Create blog error:', error);
      throw error;
    }
  }

  // Update blog post
  async updateBlog(id: string, formData: Partial<BlogFormData>): Promise<BlogResponse> {
    try {
      const form = new FormData();
      
      // Append only provided fields
      if (formData.title !== undefined) form.append('title', formData.title);
      if (formData.description !== undefined) form.append('description', formData.description);
      if (formData.content !== undefined) form.append('content', formData.content);
      if (formData.category !== undefined) form.append('category', formData.category || '');
      if (formData.status !== undefined) form.append('status', formData.status);
      
      // Handle tags
      if (formData.tags !== undefined) {
        if (Array.isArray(formData.tags)) {
          form.append('tags', formData.tags.join(','));
        } else {
          form.append('tags', formData.tags);
        }
      }
      
      // Append optional fields if provided
      if (formData.imageAlt !== undefined) form.append('imageAlt', formData.imageAlt || '');
      if (formData.excerpt !== undefined) form.append('excerpt', formData.excerpt || '');
      if (formData.metaTitle !== undefined) form.append('metaTitle', formData.metaTitle || '');
      if (formData.metaDescription !== undefined) form.append('metaDescription', formData.metaDescription || '');
      
      // Handle metaKeywords
      if (formData.metaKeywords !== undefined) {
        if (Array.isArray(formData.metaKeywords)) {
          form.append('metaKeywords', formData.metaKeywords.join(','));
        } else {
          form.append('metaKeywords', formData.metaKeywords || '');
        }
      }
      
      if (formData.canonicalUrl !== undefined) form.append('canonicalUrl', formData.canonicalUrl || '');
      if (formData.ogTitle !== undefined) form.append('ogTitle', formData.ogTitle || '');
      if (formData.ogDescription !== undefined) form.append('ogDescription', formData.ogDescription || '');
      
      // Append files if provided
      if (formData.image instanceof File) {
        form.append('image', formData.image);
      }
      if (formData.ogImage instanceof File) {
        form.append('ogImage', formData.ogImage);
      }

      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: this.getMultipartHeaders(),
        body: form,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blog');
      }

      return data;
    } catch (error) {
      console.error('Update blog error:', error);
      throw error;
    }
  }

  // Get all blogs with pagination and filters
  async getBlogs(params?: PaginationParams): Promise<BlogsListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/blogs?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch blogs');
      }

      return data;
    } catch (error) {
      console.error('Get blogs error:', error);
      throw error;
    }
  }

  // Get blog by slug
  async getBlogBySlug(slug: string): Promise<BlogResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Blog not found');
      }

      return data;
    } catch (error) {
      console.error('Get blog by slug error:', error);
      throw error;
    }
  }

  // Get blog by ID
  async getBlogById(id: string): Promise<BlogResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/id/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Blog not found');
      }

      return data;
    } catch (error) {
      console.error('Get blog by ID error:', error);
      throw error;
    }
  }

  // Delete blog
  async deleteBlog(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete blog');
      }

      return data;
    } catch (error) {
      console.error('Delete blog error:', error);
      throw error;
    }
  }

  // Like/Unlike blog
  async toggleLike(blogId: string): Promise<LikeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/like`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update like status');
      }

      return data;
    } catch (error) {
      console.error('Toggle like error:', error);
      throw error;
    }
  }

  // Get blog categories
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }

      return data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  // Get blog tags with counts
  async getTags(): Promise<TagsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tags');
      }

      return data;
    } catch (error) {
      console.error('Get tags error:', error);
      throw error;
    }
  }

  // Get related blogs
  async getRelatedBlogs(blogId: string, limit?: number): Promise<BlogsListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (limit) {
        queryParams.append('limit', limit.toString());
      }

      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/related?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch related blogs');
      }

      return data;
    } catch (error) {
      console.error('Get related blogs error:', error);
      throw error;
    }
  }

  // Helper function to get full image URL
 // Helper function to get full image URL
static getImageUrl(filename?: string): string | null {
  if (!filename) return null;
  const baseUrl = process.env.NEXT_PUBLIC_IMG_URL ;
  return `${baseUrl}/${filename}`;
}

  // Helper function to format date
  static formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Helper function to generate excerpt
  static generateExcerpt(text: string, maxLength: number = 250): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }
}

export const blogService = new BlogService();
export default blogService;