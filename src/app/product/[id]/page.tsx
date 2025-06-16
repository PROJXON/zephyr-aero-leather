import { notFound } from "next/navigation";
import Image from "next/image";
import ProductReviews from "@/components/ProductReviews";
import AddToCartButton from "@/components/AddToCartButton";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";
import type { JSX } from "react";
import type { Product, ProductPageProps } from "../../../../types/types";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getProduct(id: string): Promise<Product | null> {
  try {
    return await fetchWooCommerce(`wc/v3/products/${id}`, "Product not found");
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const products: Product[] = await fetchWooCommerce(`wc/v3/products?per_page=100`);
    return products.map((product) => ({ id: product.id.toString() }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps): Promise<JSX.Element> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.images?.[0]?.src || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="py-10">
          <h1 className="text-3xl mb-4 text-center">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4 text-right w-full">
            ${product.price}
          </p>
          <div
            className="prose max-w-none mb-8 text-right w-full"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          <div className="flex justify-end mt-6">
            <AddToCartButton
              productId={product.id}
              className="py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium transition-colors"
            />
          </div>
        </div>
      </div>

      <div id="reviews" className="mt-12 scroll-mt-24">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
