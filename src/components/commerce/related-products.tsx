import Link from "next/link"

interface RelatedProduct {
  id: string
  title: string
  price: string
  image: string
}

interface RelatedProductsProps {
  title: string
  products: RelatedProduct[]
}

export function RelatedProducts({ title, products }: RelatedProductsProps) {
  return (
    <div className="bg-white py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-light tracking-tight text-primary text-center">{title}</h2>
        <div className="mt-6 sm:mt-8 md:mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="mt-2 sm:mt-4 flex justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm text-primary">
                    <Link href={`/products/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </Link>
                  </h3>
                </div>
                <p className="text-xs sm:text-sm font-medium text-primary">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
