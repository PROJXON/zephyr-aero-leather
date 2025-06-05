"use client"
import { useState, useEffect, useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Product from "./Product"

export default function ProductCarousel({ products }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [slidesPerView, setSlidesPerView] = useState(4)

    const groupedProducts = useMemo(() => {
        const groups = []
        for (let i = 0; i < products.length; i += slidesPerView) {
            groups.push(products.slice(i, i + slidesPerView))
        }
        return groups
    }, [slidesPerView])

    const totalPages = groupedProducts.length

    useEffect(() => {
        function updateSlides() {
            setSlidesPerView(window.innerWidth < 768 ? 2 : 4)
        }

        updateSlides()
        window.addEventListener("resize", updateSlides)
        return () => window.removeEventListener("resize", updateSlides)
    }, [])

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())

        emblaApi.on("select", onSelect)
        emblaApi.reInit()
        onSelect()
    }, [emblaApi, groupedProducts.length])

    return (<div className="w-full">
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="embla__container">
                {groupedProducts.map((group, index) => (<div
                    key={index}
                    className="embla__slide box-border w-full"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {group.map(product => <Product key={product.id} product={product} />)}
                        {Array.from({ length: slidesPerView - group.length }).map((_, i) => (<div
                            key={`empty-${i}`}
                        />))}
                    </div>
                </div>))}
            </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (
                <button
                    key={index}
                    className={`h-3 w-3 rounded-full ${index === selectedIndex ? "bg-blue-600" : "bg-gray-400"}`}
                    onClick={() => emblaApi?.scrollTo(index)}
                />
            ))}
        </div>
    </div>)
}