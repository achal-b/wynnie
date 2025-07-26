"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Product } from "@/lib/flow2-product-search";
import { Flow3Result } from "@/lib/flow3-delivery-optimization";
import { CartOptimization } from "@/lib/flow4-cart-optimization";
import { formatCurrency } from "@/lib/currency";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  product?: Product; // Full product data for Flow 3 & 4
  addedAt?: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (id: string) => number;
  // Flow 3 & 4 integration
  deliveryOptimization: Flow3Result | null;
  cartOptimization: CartOptimization | null;
  isOptimizing: boolean;
  optimizeDelivery: (deliveryAddress: any) => Promise<void>;
  optimizeCart: (preferences?: any) => Promise<void>;
  applyOptimization: (optimizationId: string) => void;
  // Chat integration
  setChatMethods: (methods: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryOptimization, setDeliveryOptimization] =
    useState<Flow3Result | null>(null);
  const [cartOptimization, setCartOptimization] =
    useState<CartOptimization | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Chat integration using ref to avoid infinite renders
  const chatMethodsRef = useRef<{
    addCartMessage?: (content: string, data?: any) => void;
    addOptimizationMessage?: (
      optimizationType: "cart" | "delivery",
      data: any
    ) => void;
  }>({});

  // Chat integration method
  const setChatMethods = useCallback((methods: any) => {
    chatMethodsRef.current = methods;
    console.log("Chat methods integrated with cart");
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping-cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (
    item: Omit<CartItem, "quantity"> & { quantity?: number }
  ) => {
    const newItem = {
      ...item,
      quantity: item.quantity || 1,
      addedAt: new Date(),
    };

    let updatedItems: CartItem[];
    let totalItems: number;
    let totalPrice: number;

    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);

      if (existingItem) {
        updatedItems = prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      } else {
        updatedItems = [...prev, newItem];
      }

      // Calculate totals with the updated items array
      totalItems = updatedItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      totalPrice = updatedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return updatedItems;
    });

    setTimeout(() => {
      // Shorten product name to 40 chars and add ellipsis if needed
      const shortName =
        item.name.length > 40 ? item.name.slice(0, 37) + "..." : item.name;
      toast.success(
        `Added to Cart: ${shortName}\n${totalItems} items • Total: ₹${formatCurrency(
          totalPrice
        )}`
      );
      // Trigger cart optimization automatically when items are added
      optimizeCart();
    }, 100);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    toast.info("Cart quantity updated");
  };

  const clearCart = () => {
    setItems([]);
    setDeliveryOptimization(null);
    setCartOptimization(null);
    toast.info("Cart cleared");
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemQuantity = (id: string) => {
    const item = items.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  // Flow 3: Delivery Optimization
  const optimizeDelivery = async (deliveryAddress: any) => {
    if (items.length === 0) return;

    setIsOptimizing(true);
    try {
      // Convert cart items to products for Flow 3
      const selectedProducts = items
        .map((item) => item.product)
        .filter(Boolean);

      const response = await fetch("/api/flow3-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedProducts,
          deliveryAddress,
          userPreferences: {
            prioritySpeed: false,
            priorityCost: true,
            environmentallyFriendly: true,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDeliveryOptimization(result.data);
        console.log("✅ Delivery optimization completed:", result.data);
      } else {
        console.error("Failed to optimize delivery");
      }
    } catch (error) {
      console.error("Error optimizing delivery:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Flow 4: Cart Optimization
  const optimizeCart = async (preferences?: any) => {
    if (items.length === 0) return;

    setIsOptimizing(true);
    try {
      // Convert cart items to the format expected by Flow 4
      const cartItems = items.map((item) => ({
        id: item.id,
        product: item.product || {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: "",
          brand: "Unknown",
          category: "general",
          rating: 4.0,
          reviews: 100,
          inStock: true,
          quantity: 50,
          warehouse: {
            location: "Local",
            distance: 10,
            estimatedDelivery: "Tomorrow",
          },
          supplier: {
            id: "SUP_DEFAULT",
            name: "Default Supplier",
            reliability: 0.8,
          },
        },
        quantity: item.quantity,
        addedAt: item.addedAt || new Date(),
      }));

      const response = await fetch("/api/flow4-optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          userPreferences: preferences || {
            preferGreatValue: true,
            preferNameBrands: false,
            sustainabilityFocus: true,
            budgetConscious: true,
            nutritionFocus: false,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCartOptimization(result.data);
        console.log("✅ Cart optimization completed:", result.data);

        // Send optimization results to chat
        if (
          chatMethodsRef.current.addOptimizationMessage &&
          result.data.totalSavings > 0
        ) {
          chatMethodsRef.current.addOptimizationMessage("cart", result.data);
        }
      } else {
        console.error("Failed to optimize cart");
      }
    } catch (error) {
      console.error("Error optimizing cart:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Apply optimization recommendations
  const applyOptimization = (optimizationId: string) => {
    if (!cartOptimization) return;

    // Apply the recommended substitutions
    const updatedItems = items.map((item) => {
      const substitution = cartOptimization.recommendedSubstitutions.find(
        (sub) => sub.originalProduct.id === item.id
      );

      if (substitution) {
        return {
          ...item,
          id: substitution.suggestedProduct.id,
          name: substitution.suggestedProduct.name,
          price: substitution.suggestedProduct.price,
          image: substitution.suggestedProduct.image,
          product: substitution.suggestedProduct,
        };
      }

      return item;
    });

    setItems(updatedItems);
    setCartOptimization(null); // Clear optimization after applying
    console.log("✅ Applied cart optimization");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemQuantity,
        deliveryOptimization,
        cartOptimization,
        isOptimizing,
        optimizeDelivery,
        optimizeCart,
        applyOptimization,
        setChatMethods,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
