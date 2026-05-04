export type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export interface PublicRoute {
  path: string
  changeFrequency: ChangeFreq
  priority: number
}

// ✅ PUBLIC ROUTES (data-driven)
export const PUBLIC_ROUTES: PublicRoute[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/categories', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/products', changeFrequency: 'weekly', priority: 0.9 },
]

// ✅ PRIVATE ROUTES (blocked for SEO)
export const PRIVATE_ROUTES: string[] = [
  '/cart',
  '/checkout',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/profile',
  '/order-success',
]
