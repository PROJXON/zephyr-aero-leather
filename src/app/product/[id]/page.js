import { notFound } from "next/navigation";
import Image from "next/image";
import ProductReviews from "@/components/ProductReviews";
import AddToCartButton from "@/components/AddToCartButton";

async function getProduct(id) {
  try {
    const response = await fetch(
      `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/products/${id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Product not found");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

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
          <AddToCartButton productId={product.id} />
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
} 