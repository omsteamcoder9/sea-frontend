import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClientProductDetail from './ClientProductDetail';
import { getProductSmart, getAllProducts } from '@/lib/productService';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ SERVER-SIDE: Generate metadata
export async function generateMetadata(props: ProductDetailPageProps): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  
  if (!slug) {
    return {
      title: 'Product Not Found | Organic Store',
      description: 'The requested product could not be found.',
    };
  }

  try {
    const product = await getProductSmart(slug);
    
    if (!product) {
      return {
        title: 'Product Not Found | Organic Store',
        description: 'The requested product could not be found.',
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
    const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Organic Store';
    
    return {
      title: `${product.name} | ${storeName}`,
      description: product.description?.substring(0, 155) || 'View our premium organic products',
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 155),
        images: product.images?.[0]?.image ? [`${process.env.NEXT_PUBLIC_IMG_URL}/${product.images[0].image}`] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Details | Organic Store',
      description: 'View detailed information about our premium organic products.',
    };
  }
}

// ✅ SERVER COMPONENT: Main page
export default async function ProductDetailPage(props: ProductDetailPageProps) {
  const params = await props.params;
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  console.log(`📄 ProductDetailPage - Looking for product with slug: ${slug}`);
  
  const product = await getProductSmart(slug);
  
  if (!product) {
    console.log(`❌ Product not found for slug: ${slug}`);
    notFound();
  }

  console.log(`✅ Product found: ${product.name}`);

  // Fetch random products for "Related Products"
  const getRandomProducts = async (currentProductId: string, limit = 4) => {
    try {
      const response = await getAllProducts({});
      if (response.success && response.data) {
        const otherProducts = response.data.filter((p: any) => p._id !== currentProductId);
        const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error('Error fetching random products:', error);
      return [];
    }
  };

  const randomProducts = await getRandomProducts(product._id, 6);

  return (
    <ClientProductDetail 
      product={product} 
      randomProducts={randomProducts} 
    />
  );
}