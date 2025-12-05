"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import {
  createCartStore,
  type CartStore,
  type CartState,
  defaultInitState,
} from "./cart-store";

// Store API type
export type CartStoreApi = ReturnType<typeof createCartStore>;

// Context
const CartStoreContext = createContext<CartStoreApi | undefined>(undefined);

// Provider props
interface CartStoreProviderProps {
  children: ReactNode;
  initialState?: CartState;
}

/**
 * Cart store provider - creates one store instance per provider
 * Wrap your app/(app) layout with this provider
 * @see https://zustand.docs.pmnd.rs/guides/nextjs
 */
export const CartStoreProvider = ({
  children,
  initialState,
}: CartStoreProviderProps) => {
  const storeRef = useRef<CartStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createCartStore(initialState ?? defaultInitState);
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  );
};

/**
 * Hook to access the cart store with a selector
 * Must be used within CartStoreProvider
 */
export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
  const cartStoreContext = useContext(CartStoreContext);

  if (!cartStoreContext) {
    throw new Error("useCartStore must be used within CartStoreProvider");
  }

  return useStore(cartStoreContext, selector);
};

// ============================================
// Convenience Hooks
// ============================================

/**
 * Get all cart items
 */
export const useCartItems = () => useCartStore((state) => state.items);

/**
 * Get cart open state
 */
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);

/**
 * Get total number of items in cart
 */
export const useTotalItems = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

/**
 * Get total price of cart
 */
export const useTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

/**
 * Find a specific item in cart
 */
export const useCartItem = (productId: string) =>
  useCartStore((state) =>
    state.items.find((item) => item.productId === productId),
  );

/**
 * Get all cart actions
 */
export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
    toggleCart: state.toggleCart,
    openCart: state.openCart,
    closeCart: state.closeCart,
  }));
