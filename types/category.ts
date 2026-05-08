export interface Category {
  _id: string;
  name: string;
  slug?: string;
  image?: string | null;
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  categories: Category[];
  message?: string;
}

export interface SingleCategoryResponse {
  success: boolean;
  category: Category;
  message?: string;
}

export interface CreateCategoryData {
  name: string;
  image?: File | null;
}

export interface UpdateCategoryData {
  name: string;
  image?: File | null;
  deleteImage?: boolean;
}