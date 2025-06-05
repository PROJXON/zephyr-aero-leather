"use client"
import { useState, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Product from "./Product"

export default function ProductCarousel({ products }) {
    const [selectedPage, setSelectedPage] = useState(0)
    const [slidesPerView, setSlidesPerView] = useState(4)
    const [totalPages, setTotalPages] = useState(Math.ceil(products.length / 4))
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        slidesToScroll: slidesPerView
    })

    useEffect(() => {
        if (!emblaApi) return

        const onSelect = () => setSelectedPage(emblaApi.selectedScrollSnap())

        emblaApi.on("select", onSelect)
        emblaApi.reInit()
        onSelect()
    }, [emblaApi, slidesPerView])

    useEffect(() => {
        function updatePages() {
            const newSlidesNum = window.innerWidth < 768 ? 2 : 4
            setSlidesPerView(newSlidesNum)
            setTotalPages(Math.ceil(products.length / newSlidesNum))
        }

        updatePages()
        window.addEventListener("resize", updatePages)
        return () => window.removeEventListener("resize", updatePages)
    }, [])

    return (<div className="w-full">
        <div className="overflow-hidden -mx-3" ref={emblaRef}>
            <div className="flex">
                {products.map(product => (<div key={product.id} className="flex-shrink-0 w-1/2 md:w-1/4">
                    <div className="grid grid-cols-1">
                        <div className="px-3"><Product product={product} /></div>
                    </div>
                </div>))}
                {Array.from({ length: slidesPerView * totalPages - products.length }).map((_, i) => (<div
                    key={i}
                    className="flex-shrink-0 w-1/2 md:w-1/4"
                />))}
            </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (<button
                key={index}
                className={`h-3 w-3 rounded-full ${index === selectedPage ? "bg-blue-600" : "bg-gray-400"}`}
                onClick={() => emblaApi?.scrollTo(index)}
            />))}
        </div>
    </div>)
}