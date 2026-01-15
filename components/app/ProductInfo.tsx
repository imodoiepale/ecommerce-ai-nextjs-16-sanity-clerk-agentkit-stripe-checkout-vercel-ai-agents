import Link from "next/link";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { AskAISimilarButton } from "@/components/app/AskAISimilarButton";
import { StockBadge } from "@/components/app/StockBadge";
import { formatPrice } from "@/lib/utils";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const imageUrl = product.images?.[0]?.asset?.url;

  return (
    <div className="flex flex-col space-y-6">
      {/* Category */}
      {product.category && (
        <Link
          href={`/?category=${product.category.slug}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {product.category.title}
        </Link>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {product.name}
      </h1>

      {/* Price */}
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {formatPrice(product.price)}
      </p>

      {/* Description */}
      {product.description && (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      )}

      {/* Stock & Add to Cart */}
      <div className="flex flex-col gap-3">
        <StockBadge productId={product._id} stock={product.stock ?? 0} />
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Unknown Product"}
          price={product.price ?? 0}
          image={imageUrl ?? undefined}
          stock={product.stock ?? 0}
        />
        <AskAISimilarButton productName={product.name ?? "this product"} />
      </div>

      {/* Description Section */}
      {product.description && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">
            Description
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>
        </div>
      )}

      {/* Product Details Section */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
          Product Details
        </h2>
        <div className="space-y-3">
          {product.material && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Material</span>
              <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                {product.material}
              </span>
            </div>
          )}
          {product.color && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Color</span>
              <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                {product.color}
              </span>
            </div>
          )}
          {product.dimensions && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Dimensions</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {product.dimensions}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Stock</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {product.stock ?? 0} units available
            </span>
          </div>
          {product.assemblyRequired !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Assembly</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {product.assemblyRequired ? "Required" : "Not required"}
              </span>
            </div>
          )}
          {product.featured !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Featured</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {product.featured ? "Yes" : "No"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
