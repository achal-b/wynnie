"use client";

import { GoZap } from "react-icons/go";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  ShoppingCart,
  Clock,
  MapPin,
  Zap,
  Shield,
  Heart,
  Share,
  Truck,
  Package,
  TrendingDown,
  Users,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { formatCurrencyShort } from "@/lib/currency";
import { FaIndianRupeeSign } from "react-icons/fa6";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  quantity: number;
  isGreatValue?: boolean;
  warehouse: {
    location: string;
    distance: number;
    estimatedDelivery: string;
  };
  supplier: {
    id: string;
    name: string;
    reliability: number;
  };
}

interface BestMatchProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  timerProgress?: number; // 0 to 1, optional
  isActive?: boolean; // indicates if this card is currently active
  showNextButton?: boolean; // show Next button inside card
  onNextClick?: () => void; // handler for Next button
}

export const BestMatchProductCard: React.FC<BestMatchProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  timerProgress, // new prop
  isActive = false,
  showNextButton, // new prop
  onNextClick, // new prop
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAllDeliveryInfo, setShowAllDeliveryInfo] = useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(
      1,
      Math.min(product.quantity, quantity + change)
    );
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
  };

  const savings = product.originalPrice
    ? product.originalPrice - product.price
    : 0;
  const isLowStock = product.quantity <= 5 && product.quantity > 0;

  // Delivery info items
  const deliveryInfo = [
    {
      icon: <Clock className="w-3.5 h-3.5" />,
      text: `Estimated delivery: ${product.warehouse.estimatedDelivery}`,
    },
    {
      icon: <MapPin className="w-3.5 h-3.5" />,
      text: `Distance from warehouse: ${product.warehouse.distance} mi`,
    },
    {
      icon: <Truck className="w-3.5 h-3.5" />,
      text: "Free shipping over ₹200",
    },
    {
      icon: <Shield className="w-3.5 h-3.5" />,
      text: "30-day return policy",
    },
  ];

  return (
    <div
      className={`relative border w-full h-full flex flex-col md:flex-row md:items-stretch bg-card rounded-xl p-4 overflow-hidden ${
        isActive ? "ring-2 ring-primary/20 shadow-lg" : ""
      } md:min-h-[340px] lg:min-h-[400px]`}
      data-product-id={product.id}
    >
      {/* Next Button in top right */}
      {showNextButton && (
        <div className="absolute top-5 right-5 z-20">
          <Button
            onClick={onNextClick}
            className="px-4 py-0.5 text-sm font-semibold bg-red-500 text-white hover:bg-red-600"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      )}
      {/* Animated timer background - Fixed layout */}
      {typeof timerProgress === "number" && (
        <div
          className="absolute inset-0 z-0 timer-background pointer-events-none"
          style={{
            width: `${Math.max(0, timerProgress) * 100}%`,
            background: "#D1FADF", // match order success green
            transition: "width 0.2s linear",
          }}
        />
      )}
      {/* Card content above background */}
      <div className="relative z-10 flex flex-col h-full">
        {/* AI Recommended Best Match Label */}
        <div className="relative">
          <div className="flex border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 bg-white items-center px-2 py-1 rounded-full w-fit absolute z-1 top-2 left-2 gap-2 mb-2 text-xs">
            <GoZap className="w-3.5 h-3.5" />
            AI Recommended Best Match
            {/* {isActive && (
              <div className="flex items-center gap-1 ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Active</span>
              </div>
            )} */}
          </div>
        </div>

        {/* Product Image and Main Info */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full md:items-stretch w-full">
          {/* Product Image */}
          <div
            className="relative flex-shrink-0 border rounded-lg h-fit w-full md:w-[340px] lg:w-[400px] md:h-full md:aspect-square overflow-hidden bg-white"
            style={{ minWidth: "0" }}
          >
            <Image
              src={product.image || "/Home.png"}
              alt={product.name}
              width={1000}
              height={1000}
              className="object-cover rounded-lg bg-muted w-full h-auto md:h-full md:w-full md:aspect-square"
              quality={95}
              onError={(e) => {
                e.currentTarget.src = "/Home.png";
              }}
            />
            {/* Product Title Overlay for sm screens */}
            <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded font-medium text-sm shadow-md block md:hidden">
              {product.name}
            </div>
            {/* Quick Action Buttons */}
            <div className="absolute top-15 right-2 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/80 hover:bg-white/90"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/80 hover:bg-white/90"
              >
                <Share className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-3 h-full w-full flex-1 md:justify-center">
            <div className="flex flex-col gap-1">
              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <span className="text-xs bg-gradient-to-b from-primary/60 to-primary/80 bg-clip-text text-transparent font-medium">
                    ✓ In Stock ({product.quantity} available)
                  </span>
                ) : (
                  <span className="text-xs text-red-600 font-medium">
                    ✗ Out of Stock
                  </span>
                )}
              </div>

              {/* Low Stock Warning */}
              {isLowStock && (
                <div className="text-xs text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                  ⚠️ Only {product.quantity} left in stock!
                </div>
              )}

              {/* Product Name and Brand */}
              <h1 className="text-lg font-medium line-clamp-2 hidden md:block text-start">
                {product.name}
              </h1>
            </div>

            {/* Supplier Reliability */}
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-foreground/80">
                {product.supplier.name} (
                {Math.round(product.supplier.reliability * 100)}% reliable)
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{product.rating.toFixed(1)}</span>(
              {product.reviews} reviews)
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2 py-2 md:py-5">
              {/* Savings Display */}
              {savings > 0 && (
                <div className="flex gap-2">
                  <div className="text-[11px] uppercase bg-primary text-primary-foreground rounded-full px-2 py-1 w-fit font-medium flex items-center gap-1">
                    SAVE
                    <div className="text-[11px] flex items-center">
                      <FaIndianRupeeSign className="text-[11px]" />{" "}
                      {Math.round(
                        Number(
                          formatCurrencyShort(savings).replace(/[^\d.]/g, "")
                        )
                      )}
                    </div>
                  </div>
                  <div className="text-[11px] uppercase bg-accent text-accent-foreground rounded-full px-2 py-1 w-fit font-medium flex items-center gap-1">
                    {product.discount}% OFF
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <span className="font-bold text-3xl bg-gradient-to-t from-primary/50 to-primary bg-clip-text text-transparent flex items-center">
                  <FaIndianRupeeSign className="text-primary scale-90" />
                  {Math.round(
                    Number(
                      formatCurrencyShort(product.price).replace(/[^\d.]/g, "")
                    )
                  )}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-foreground/80 line-through flex items-center">
                    <FaIndianRupeeSign className="scale-95 line-through" />{" "}
                    {Math.round(
                      Number(
                        formatCurrencyShort(product.originalPrice).replace(
                          /[^\d.]/g,
                          ""
                        )
                      )
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Delivery Info */}
            <div className="text-xs text-foreground/80 grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Responsive delivery info: sm = 1 item + dropdown, md+ = all */}
              <div className="flex flex-col gap-2 w-full md:hidden">
                {deliveryInfo.slice(0, 1).map((item, idx) => (
                  <div className="flex items-center gap-2" key={idx}>
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
                {deliveryInfo.length > 1 && !showAllDeliveryInfo && (
                  <button
                    className="flex items-center gap-1 text-primary font-medium mt-1 text-xs focus:outline-none"
                    onClick={() => setShowAllDeliveryInfo(true)}
                  >
                    <ChevronDown className="w-4 h-4" /> Show more
                  </button>
                )}
                {showAllDeliveryInfo && (
                  <>
                    {deliveryInfo.slice(1).map((item, idx) => (
                      <div className="flex items-center gap-2" key={idx + 1}>
                        {item.icon}
                        <span>{item.text}</span>
                      </div>
                    ))}
                    <button
                      className="flex items-center gap-1 text-primary font-medium mt-1 text-xs focus:outline-none"
                      onClick={() => setShowAllDeliveryInfo(false)}
                    >
                      <ChevronUp className="w-4 h-4" /> Show less
                    </button>
                  </>
                )}
              </div>
              {/* md+ screens: show all */}
              <div className="hidden md:grid md:col-span-2 md:grid-cols-2 gap-2">
                {deliveryInfo.map((item, idx) => (
                  <div className="flex items-center gap-2" key={idx}>
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions pinned to bottom */}
            <div className="flex gap-2 mt-auto pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-3 text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart ({quantity})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
