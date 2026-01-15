// @ts-nocheck
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDER_BY_ID_QUERY } from "@/lib/sanity/queries/orders";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatPrice, formatDate } from "@/lib/utils";
import type { ORDER_BY_ID_QUERYResult } from "@/sanity.types";

export const metadata = {
  title: "Order Details | Furniture Shop",
  description: "View your order details",
};

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: order } = await sanityFetch({
    query: ORDER_BY_ID_QUERY,
    params: { id },
  });

  // Verify order exists and belongs to current user
  if (!order || order.clerkUserId !== userId) {
    notFound();
  }

  // Type assertion after null check
  const validOrder = order as NonNullable<typeof order>;

  const status = getOrderStatus(validOrder.status);
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Order #{validOrder.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Placed on {formatDate(validOrder.createdAt)}
            </p>
          </div>
          <Badge className={`${status.color} flex items-center gap-1.5`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Order Items */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Items ({validOrder.items?.length ?? 0})
              </h2>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {validOrder.items?.map((item: NonNullable<typeof validOrder.items>[number]) => (
                <div key={item._key} className="flex gap-4 px-6 py-4">
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                    {item.product?.image?.asset?.url ? (
                      <Image
                        src={item.product.image.asset.url}
                        alt={item.product.name ?? "Product"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.product?.slug}`}
                        className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                      >
                        {item.product?.name ?? "Unknown Product"}
                      </Link>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatPrice(
                        (item.priceAtPurchase ?? 0) * (item.quantity ?? 1),
                      )}
                    </p>
                    {(item.quantity ?? 1) > 1 && (
                      <p className="text-sm text-zinc-500">
                        {formatPrice(item.priceAtPurchase)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Order Summary
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Subtotal
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {formatPrice(validOrder.total)}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <div className="flex justify-between font-semibold">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {formatPrice(validOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {validOrder.address && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-zinc-400" />
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Shipping Address
                </h2>
              </div>
              <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                {validOrder.address.name && <p>{validOrder.address.name}</p>}
                {validOrder.address.line1 && <p>{validOrder.address.line1}</p>}
                {validOrder.address.line2 && <p>{validOrder.address.line2}</p>}
                <p>
                  {[validOrder.address.city, validOrder.address.postcode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {validOrder.address.country && <p>{validOrder.address.country}</p>}
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-zinc-400" />
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Payment
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-light tracking-wide">Status</span>
                <span className="text-sm font-medium capitalize text-green-600">
                  {validOrder.status}
                </span>
              </div>
              {validOrder.email && (
                <div className="flex items-center justify-between">
                  <p className="text-xs font-light tracking-wide">Email</p>
                  <p className="min-w-0 truncate text-sm text-zinc-900 dark:text-zinc-100">
                    {validOrder.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
