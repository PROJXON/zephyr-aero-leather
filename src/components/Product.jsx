import Image from "next/image"
import Link from "next/link"
import AddToCartButton from "./AddToCartButton"

export default function Product({ product }) {
    return (<div className="group w-full">
        {/* Image Card */}
        <Link href={`/product/${product.id}`}>
            <div className="relative w-full aspect-square bg-card mb-3 overflow-hidden shadow-sm">
                <Image
                    src={product.images[0]?.src || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
        </Link>

        {/* Product Info */}
        <div>
            <Link href={`/product/${product.id}`}>
                <h3 className="text-neutral-dark font-medium hover:underline">{product.name}</h3>
            </Link>
            <p className="text-neutral-medium mb-2">
                {product.price ? `$${product.price}` : "Price not available"}
            </p>
            <AddToCartButton
                productId={product.id}
            />
        </div>
    </div>)
}