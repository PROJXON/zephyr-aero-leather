import { notFound } from "next/navigation";
import Image from "next/image";
import ProductReviews from "@/components/ProductReviews";
import AddToCartButton from "@/components/AddToCartButton";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getProduct(id) {
  try {
    return await fetchWooCommerce(`wc/v3/products/${id}`, "Product not found");
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const products = await fetchWooCommerce(`wc/v3/products?per_page=100`);
    return products.map((product) => ({ id: product.id.toString() }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 pt-6 pb-12">
    
      <div className="mb-4 text-sm text-neutral-medium">
        <Link href="/" className="hover:text-neutral-dark transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-neutral-dark transition-colors">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-dark">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 md:gap-12">
        
        <div className="space-y-1 md:space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50">
            <Image
              src={product.images[0]?.src || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-contain p-4 transition-all duration-300 hover:scale-105"
              priority
            />
          </div>
        
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-neutral-medium transition-colors cursor-pointer"
                >
                  <Image
                    src={image.src}
                    alt={`${product.name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 pt-2 md:pt-8">
          <div className="border-b border-neutral-light pb-6">
            <h1 className="text-lg md:text-xl font-bold text-neutral-dark mb-2 tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-xl text-neutral-dark font-medium">
                ${product.price}
              </p>
              <a 
                href="#reviews" 
                className="text-sm text-neutral-medium hover:text-neutral-dark transition-colors flex items-center gap-1"
              >
                <span>Reviews</span>
                <FaChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="prose max-w-none text-neutral-medium text-base font-light tracking-wide">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>

          <div className="pt-4">
            <AddToCartButton
              productId={product.id}
              className="w-full md:w-auto py-3 px-6 text-base font-medium bg-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-medium transition-colors shadow-md"
            />
          </div>
        </div>
      </div>

      <div 
        id="reviews" 
        className="mt-12 border-t border-neutral-light pt-8 scroll-mt-24"
      >
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}