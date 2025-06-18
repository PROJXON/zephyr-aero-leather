import { MetadataRoute } from 'next';
import fetchWooCommerce from '../../lib/fetchWooCommerce';
import type { Product } from '../../types/types';

// Revalidate every hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all products
    let allProducts: Product[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const products: Product[] = await fetchWooCommerce(`wc/v3/products?per_page=100&page=${page}`);
      if (products.length === 0) {
        hasMore = false;
      } else {
        allProducts = [...allProducts, ...products];
        page++;
      }
    }

    // Static pages with their last modified dates
    const staticPages = [
      {
        url: 'https://zephyraeroleather.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: 'https://zephyraeroleather.com/about-us',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: 'https://zephyraeroleather.com/contact',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: 'https://zephyraeroleather.com/privacy-policy',
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
      },
      {
        url: 'https://zephyraeroleather.com/terms-of-service',
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
      },
    ];

    // Product pages with their last modified dates
    const productPages = allProducts.map((product) => ({
      url: `https://zephyraeroleather.com/product/${product.id}`,
      lastModified: product.modified ? new Date(product.modified) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static pages if product fetching fails
    return [
      {
        url: 'https://zephyraeroleather.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ];
  }
} 