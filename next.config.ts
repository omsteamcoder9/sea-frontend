import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   env: {
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ,
    NEXT_PUBLIC_TWITTER_HANDLE: process.env.NEXT_PUBLIC_TWITTER_HANDLE ,
    NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ,
  },
 
   /* config options here */
  // output: "export",
  trailingSlash: true,
  images: {
    
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
