import { ShoppingBag } from "lucide-react"

export function FloatingCartButton() {
  return (
    <div className="fixed bottom-6 right-6">
      <button className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-accent transition-colors">
        <ShoppingBag className="h-6 w-6" />
      </button>
    </div>
  )
}
