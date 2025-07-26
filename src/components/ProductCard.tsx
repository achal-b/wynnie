"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrencyShort } from "@/lib/currency";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category?: string;
  inStock?: boolean;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  category,
  inStock = true,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItemQuantity } = useCart();
  const cartQuantity = getItemQuantity(id);

  const handleAddToCart = () => {
    // Create full product object for Flow 3 & 4 integration
    const product = {
      id,
      name,
      description,
      price,
      brand: "Unknown", // Could be extracted from name or passed as prop
      category: category || "general",
      image,
      rating,
      reviews: reviewCount,
      inStock: inStock,
      quantity: 50, // Default stock quantity
      warehouse: {
        location: "Local Store",
        distance: 10,
        estimatedDelivery: "Tomorrow",
      },
      supplier: {
        id: "SUP_DEFAULT",
        name: "Default Supplier",
        reliability: 0.8,
      },
    };

    addToCart({
      id,
      name,
      price,
      image,
      quantity,
      product, // Pass full product data for Flow 3 & 4
    });
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square bg-muted">
          <Image
            src={image || "/Home.png"}
            width={400}
            height={400}
            alt={name}
            className="w-full h-full object-cover"
            quality={95}
            onError={(e) => {
              e.currentTarget.src = `/Home.png`;
            }}
          />
          {category && (
            <Badge
              className="absolute top-2 left-2 text-xs"
              variant="secondary"
            >
              {category}
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-2 right-2 text-xs bg-red-500 text-white">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-medium text-sm line-clamp-2">{name}</h3>
            <p className="text-xs text-foreground/80 line-clamp-2 mt-1">
              {description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium ml-1">{rating}</span>
            </div>
            <span className="text-xs text-foreground/80">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">
              {formatCurrencyShort(price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-foreground/80 line-through">
                {formatCurrencyShort(originalPrice)}
              </span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-3 text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              className="flex-1 h-8 text-xs"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {cartQuantity > 0 ? `Added (${cartQuantity})` : "Add to Cart"}
            </Button>
          </div>

          {!inStock && (
            <p className="text-xs text-red-500 text-center">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
