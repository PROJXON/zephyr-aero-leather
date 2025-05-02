import { notFound } from "next/navigation";
import Image from "next/image";
import ProductReviews from "@/components/ProductReviews";
import AddToCartButton from "@/components/AddToCartButton";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce"

export const revalidate = 60

async function getProduct(id) {
  try {
    return await fetchWooCommerce(`wc/v3/products/${id}`, "Product not found")
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const p = await params
  const product = await getProduct(p.id);

  if (!product) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="relative aspect-square">
          <Image
            src={product.images[0]?.src || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Detalles del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-4">
            ${product.price}
          </p>
          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          <AddToCartButton productId={product.id} className="px-6 py-3 rounded-lg" />
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
} 