import Link from "next/link"
import ProductList from "./ProductList"

export default function Section({ title, products, link }) {
    if (!products || products.length === 0) return null;

    return (<section className="py-16">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-neutral-dark font-normal">{title}</h2>
                <Link
                    href={link}
                    className="py-2 px-4 rounded bg-blue-500 text-white font-medium transition-colors hover:bg-blue-600"
                >
                    View All
                </Link>
            </div>
            <ProductList products={products} />
        </div>
    </section>)
}