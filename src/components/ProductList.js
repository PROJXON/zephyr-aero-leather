"use client"
import Product from "./Product"

export default function ProductList({ products }) {
  if (!products || products.length === 0) return <p className="text-neutral-medium">No products found.</p>

  return (<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {products.map(product => <Product key={product.id} product={product} />)}
  </div>)
}
