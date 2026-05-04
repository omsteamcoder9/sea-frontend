export interface Category {
  _id: string;
  name: string;
  slug?: string;
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