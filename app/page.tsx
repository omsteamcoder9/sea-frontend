import { fetchCategories } from '@/lib/categoryService';  // ← CHANGE THIS
import HomeClient from '@/components/home/HomeClient';

// ✅ SERVER COMPONENT - Home Page
export default async function HomePage() {
  const categories = await fetchCategories();  // ← CHANGE THIS
  const featuredCategories = categories.slice(0, 3);

  return (
    <HomeClient 
      categories={categories}
      featuredCategories={featuredCategories}
    />
  );
}