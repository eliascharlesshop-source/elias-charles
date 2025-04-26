import Link from "next/link"
import { ProductTitle, ProductPrice } from "./typography"

interface Product {
  id: string | number
  title: string
  price?: string
  originalPrice?: string
  salePrice?: string
  discount?: string
  image: string
}

interface ResponsiveProductGridProps {
  products: Product[]
  showDiscount?: boolean
}

export function ResponsiveProductGrid({ products, showDiscount = false }: ResponsiveProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-y-8 gap-x-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-sm bg-gray-100">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
            />
            {showDiscount && product.discount && (
              <div className="absolute top-0 right-0 m-2">
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  {product.discount}
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 sm:mt-4 flex justify-between">
            <div>
              <h3 className="text-xs sm:text-sm text-primary">
                <Link href={`/products/${product.id}`}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  <ProductTitle>{product.title}</ProductTitle>
                </Link>
              </h3>
            </div>
            <div>
              {showDiscount && product.salePrice ? (
                <>
                  <p className="text-xs sm:text-sm font-medium text-primary">{product.salePrice}</p>
                  {product.originalPrice && (
                    <p className="text-xs sm:text-sm text-gray-500 line-through">{product.originalPrice}</p>
                  )}
                </>
              ) : (
                <ProductPrice>{product.price}</ProductPrice>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
