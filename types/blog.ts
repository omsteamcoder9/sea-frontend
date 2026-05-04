// types/blog.ts

export interface UserRef {
  _id: string;
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
}

export interface CommentRef {
  _id: string;
  content: string;
  author: UserRef | string;
  createdAt: Date;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  imageAlt?: string;
  imageUrl?: string; // Virtual field
  excerpt?: string;
  author: UserRef;
  authorName?: string;
  category?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageUrl?: string; // Virtual field
  
  // Stats
  readTime: number;
  views: number;
  likes: string[]; // Array of user IDs
  comments: CommentRef[] | string[]; // Can be populated or just IDs
  
  // Timestamps
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogFormData {
  title: string;
  description: string;
  content: string;
  image?: File;
  imageAlt?: string;
  excerpt?: string;
  category?: string;
  tags: string[] | string;
  status: 'draft' | 'published' | 'archived';
  
  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[] | string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: File;
}

export interface BlogResponse {
  success: boolean;
  message?: string;
  data: Blog;
}

export interface BlogsListResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Blog[];
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  data: string[];
}

export interface TagWithCount {
  tag: string;
  count: number;
}

export interface TagsResponse {
  success: boolean;
  count: number;
  data: TagWithCount[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  sort?: string;
}

export interface LikeResponse {
  success: boolean;
  message: string;
  likesCount: number;
  isLiked: boolean;
}