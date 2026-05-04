// types/routes.ts
export interface ProductPageParams {
  slug: string;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface ProductPageProps {
  params: ProductPageParams;
  searchParams: SearchParams;
}