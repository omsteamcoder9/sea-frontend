import { productAPI } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClientProductDetail from './ClientProductDetail';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ SERVER-SIDE: Generate metadata - OPTIMIZED VERSION
export async function generateMetadata(props: ProductDetailPageProps): Promise<Metadata> {
  const params = await props.params;
  
  try {
    const response = await productAPI.getBySlug(params.slug);
    
    if (!response.success || !response.data) {
      return {
        title: 'Product Not Found | Organic Store',
        description: 'The requested product could not be found.',
      };
    }

    const product = response.data;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const storeName = process.env.NEXT_PUBLIC_SITE_NAME;
    const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE ;
    
    // Extract product name (handles both string and object category)
    const productName = product.name;
    const categoryName = typeof product.category === 'object' 
      ? product.category.name 
      : 'organic products';
    
    // ✅ Get offer information for rich snippets
    const hasOffer = product.hasOffer && product.originalPrice && product.discountPercentage;
    const discountPercentage = product.discountPercentage || 0;
    const currentPrice = product.basePrice;
    const originalPrice = product.originalPrice || product.basePrice;
    
    // ✅ Calculate savings for rich snippets
    const savings = hasOffer 
      ? originalPrice - currentPrice 
      : 0;
    
    // ✅ Get stock status for rich snippets
    const availability = product.stock > 0 
      ? 'https://schema.org/InStock' 
      : 'https://schema.org/OutOfStock';
    
    // ✅ Get product condition
    const condition = 'https://schema.org/NewCondition';
    
    // ✅ Get weight information for rich snippets
    let weightInfo = '';
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
      if (defaultVariant.weight && defaultVariant.weightUnit) {
        const weight = defaultVariant.weight;
        const unit = defaultVariant.weightUnit === 'kg' ? 'kilogram' : 
                    defaultVariant.weightUnit === 'gram' ? 'gram' :
                    defaultVariant.weightUnit === 'ml' ? 'milliliter' :
                    defaultVariant.weightUnit === 'liter' ? 'liter' : 'item';
        weightInfo = `${weight} ${unit}`;
      }
    }

    // ✅ Meta Title - Use product.metaTitle if available
    const metaTitle = product.metaTitle?.trim() || 
      `${productName} | ${categoryName} | ${storeName}`;
    
    // ✅ Meta Description - Use product.metaDescription if available
    const metaDescription = product.metaDescription?.trim() || 
      `${product.description.substring(0, 155)}... Buy ${productName} at ₹${currentPrice.toLocaleString('en-IN')}${
        hasOffer ? ` (Save ${discountPercentage}%)` : ''
      }. Free shipping, 100% organic, money-back guarantee.`;
    
    // ✅ Canonical URL
    const canonicalUrl = product.canonicalUrl?.trim() || 
      `${siteUrl}/products/${product.slug}`;
    
    // ✅ Open Graph Image
    let ogImage = '';
    if (product.ogImage?.trim()) {
      ogImage = product.ogImage.startsWith('http') 
        ? product.ogImage 
        : `${baseUrl}${product.ogImage}`;
    } else if (product.images && product.images.length > 0 && product.images[0]?.image) {
      const imgPath = product.images[0].image;
      ogImage = imgPath.startsWith('http') 
        ? imgPath 
        : `${baseUrl}${imgPath}`;
    } else {
      ogImage = `${siteUrl}/og-image.png`;
    }
    
    // ✅ Open Graph Title
    const ogTitle = product.ogTitle?.trim() || metaTitle;
    
    // ✅ Open Graph Description
    const ogDescription = product.ogDescription?.trim() || metaDescription;

    // ✅ Keywords
    const defaultKeywords = [
      productName.toLowerCase(),
      categoryName.toLowerCase(),
      'organic',
      'natural',
      'buy online',
      'best price',
     
    ];
    
    const keywords = product.metaKeywords && product.metaKeywords.length > 0
      ? [...product.metaKeywords, ...defaultKeywords]
      : defaultKeywords;

    // ✅ Generate JSON-LD structured data for rich snippets
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productName,
      description: metaDescription,
      image: ogImage,
      brand: {
        '@type': 'Brand',
        name: product.seller || storeName,
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'INR',
        price: currentPrice,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Valid for 30 days
        itemCondition: condition,
        availability: availability,
        ...(hasOffer && {
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: currentPrice,
            priceCurrency: 'INR',
            valueAddedTaxIncluded: true,
          }
        })
      },
      ...(hasOffer && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating || 4.5,
          ratingCount: product.numberOfReviews || 10,
          bestRating: 5,
          worstRating: 1,
        },
      }),
      ...(weightInfo && {
        weight: weightInfo,
      }),
      sku: product._id,
      mpn: product._id,
      category: categoryName,
    };

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: keywords,
      authors: [{ name: product.seller || storeName }],
      creator: product.seller || storeName,
      publisher: storeName,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: storeName,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${productName} - ${storeName}`,
          },
        ],
        locale: 'en_IN',
        type: 'article',
        publishedTime: product.createdAt,
        modifiedTime: product.updatedAt,
      },
      twitter: {
        card: 'summary_large_image',
        site: twitterHandle,
        creator: twitterHandle,
        title: ogTitle,
        description: ogDescription,
        images: [ogImage],
      },
      other: {
        // ✅ Product-specific meta tags
        'product:price:amount': currentPrice.toString(),
        'product:price:currency': 'INR',
        'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:brand': product.seller,
        'product:retailer_item_id': product._id,
        'product:sku': product._id,
        
        // ✅ Organic/Natural indicators
        'product:organic': 'yes',
        'product:natural': 'yes',
        'product:handmade': 'yes',
        'product:chemical-free': 'yes',
        
        // ✅ Category and tags
        'product:category': categoryName,
        'product:material': 'Organic Ingredients',
        'product:country_of_origin': 'India',
        
        // ✅ SEO enhancements
        'og:price:amount': currentPrice.toString(),
        'og:price:currency': 'INR',
        'twitter:label1': 'Price',
        'twitter:data1': `₹${currentPrice.toLocaleString('en-IN')}`,
        'twitter:label2': 'Category',
        'twitter:data2': categoryName,
        
        // ✅ Add JSON-LD structured data
        'application/ld+json': JSON.stringify(jsonLd),
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

  // Fetch product data on server
  const response = await productAPI.getBySlug(params.slug);
  
  if (!response.success || !response.data) {
    notFound();
  }

  const product = response.data;

  // ✅ Generate JSON-LD structured data for this page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.metaDescription || product.description.substring(0, 155) + '...',
    image: product.ogImage || 
      (product.images && product.images.length > 0 && product.images[0]?.image 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${product.images[0].image}`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`),
    brand: {
      '@type': 'Brand',
      name: product.seller || process.env.NEXT_PUBLIC_SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.basePrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      ratingCount: product.numberOfReviews || 1,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    sku: product._id,
    category: typeof product.category === 'object' ? product.category.name : 'organic products',
  };

  // Fetch random products for "Related Products"
  const getRandomProducts = async (currentProductId: string, limit = 4) => {
    try {
      const response = await productAPI.getAll({});
      if (response.success && response.data) {
        const otherProducts = response.data.filter(p => p._id !== currentProductId);
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

  // Pass data to client component
  return (
    <>
      {/* ✅ Add JSON-LD structured data to page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ClientProductDetail 
        product={product} 
        randomProducts={randomProducts} 
      />
    </>
  );
}