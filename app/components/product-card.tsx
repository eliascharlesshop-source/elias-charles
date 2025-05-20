import Link from "next/link"
import { ProductTitle, ProductPrice } from "./typography"
import { ProductTag } from "./product-tag"

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    href: string
    price: string
    imageSrc: string
    imageAlt: string
    isNew?: boolean
    isSale?: boolean
    isLimited?: boolean
    isBestseller?: boolean
    salePercentage?: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="beach-card group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-100 rounded-sm">
        <img
          src={product.imageSrc || "/placeholder.svg"}
          alt={product.imageAlt}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-beach-darker/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Product tags positioned in the top-left corner */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNew && <ProductTag type="new">New</ProductTag>}
          {product.isSale && (
            <ProductTag type="sale">{product.salePercentage ? `${product.salePercentage}% Off` : "Sale"}</ProductTag>
          )}
          {product.isLimited && <ProductTag type="limited">Limited</ProductTag>}
          {product.isBestseller && <ProductTag type="bestseller">Bestseller</ProductTag>}
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="max-w-[70%]">
          <ProductTitle>
            <Link href={product.href} className="hover:text-beach-darker transition-colors duration-300">
              <span className="absolute inset-0" />
              {product.name}
            </Link>
          </ProductTitle>
        </div>
        <ProductPrice className="ml-2 text-beach-darker font-medium">{product.price}</ProductPrice>
      </div>
    </div>
  )
}
