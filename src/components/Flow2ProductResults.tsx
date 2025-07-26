import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  ShoppingCart,
  Clock,
  MapPin,
  Zap,
  Minus,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { BestMatchProductCard } from "./BestMatchProductCard";
import { ProductNotFound } from "./ProductNotFound";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import "@/styles/swiper.css";

// import required modules
import { Pagination, EffectCards } from "swiper/modules";
import { formatCurrencyShort } from "@/lib/currency";

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

interface SearchResult {
  products: Product[];
  query: string;
  suggestions: string[];
  totalResults: number;
  searchTime: number;
  bestMatch?: Product;
}

interface Flow2ResultsProps {
  results: SearchResult;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onSearch?: (query: string) => void;
  onRetry?: () => void;
  onTimerComplete?: () => void;
}

export const Flow2ProductResults: React.FC<Flow2ResultsProps> = ({
  results,
  onAddToCart,
  onViewDetails,
  onSearch,
  onRetry,
  onTimerComplete,
}) => {
  // Filter out unavailable products (allow missing/placeholder descriptions)
  const availableProducts =
    results?.products?.filter(
      (product) => product.inStock && product.quantity > 0
    ) || [];

  // Timer state for best match card
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerProgress, setTimerProgress] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const swiperRef = useRef<any>(null); // Swiper instance
  const totalTime = 20;

  // Start/reset timer when slide changes or products change
  useEffect(() => {
    if (availableProducts.length > 0) {
      setTimerActive(true);
      setTimeLeft(totalTime);
      setTimerProgress(0);
      // Force immediate render to prevent flickering
      requestAnimationFrame(() => {
        setTimerProgress(0);
      });
    }
  }, [
    currentSlideIndex,
    availableProducts.length > 0 ? availableProducts[0].id : null,
  ]);

  // Smooth countdown effect using requestAnimationFrame
  useEffect(() => {
    if (!timerActive) return;

    let startTime = Date.now();
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newTimeLeft = Math.max(0, totalTime - elapsed / 1000);

      if (newTimeLeft <= 0) {
        setTimerActive(false);
        setTimerProgress(1);
        
        // Auto-add the best match product (first product) to cart when timer expires
        if (availableProducts.length > 0) {
          const bestMatchProduct = availableProducts[0];
          onAddToCart(bestMatchProduct);
          console.log("⏰ Timer expired - Auto-added best match product to cart:", bestMatchProduct.name);
          
          // Show visual feedback that product was auto-added
          const productElement = document.querySelector(`[data-product-id="${bestMatchProduct.id}"]`);
          if (productElement) {
            productElement.classList.add('auto-added-product');
            setTimeout(() => {
              productElement.classList.remove('auto-added-product');
            }, 3000);
          }
        }
        
        onTimerComplete?.();
        return;
      }

      setTimeLeft(newTimeLeft);
      setTimerProgress(1 - newTimeLeft / totalTime);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [timerActive, totalTime, currentSlideIndex, onTimerComplete]);

  if (!results || availableProducts.length === 0) {
    return (
      <ProductNotFound
        query={results?.query}
        suggestions={results?.suggestions || []}
        onSearch={onSearch}
        onRetry={onRetry}
      />
    );
  }

  const formatPrice = (price: number) => formatCurrencyShort(price);
  const calculateSavings = (original: number, current: number) =>
    formatCurrencyShort(original - current);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search Summary */}
      <div className="flex md:flex-row md:items-center md:gap-10 md:justify-between text-xs font-light text-foreground/80 flex-col justify-start gap-1">
        <span>Search Results for "{results.query}"</span>
        <span>
          {availableProducts.length} available products found in{" "}
          {results.searchTime}ms
        </span>
      </div>

      {/* Best Match Cards with Swiper */}
      <div className="relative h-full mt-5">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          // grabCursor={true}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          onSlideChange={(swiper) => {
            setCurrentSlideIndex(swiper.activeIndex);
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full h-full py"
          style={
            {
              "--swiper-navigation-color": "blue",
              "--swiper-pagination-color": "blue",
            } as React.CSSProperties
          }
        >
          {availableProducts.slice(0, 4).map((product, index) => (
            <SwiperSlide
              key={product.id}
              className="flex justify-center items-center "
            >
              <div className="w-full h-full flex items-center justify-center">
                <BestMatchProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  timerProgress={
                    index === currentSlideIndex ? timerProgress : undefined
                  }
                  isActive={index === currentSlideIndex}
                  showNextButton={
                    index === currentSlideIndex &&
                    index < availableProducts.slice(0, 4).length - 1 &&
                    timerProgress >= 0.75 // Show when 5s left (15/20 = 0.75)
                  }
                  onNextClick={() => swiperRef.current?.slideNext()}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Search Suggestions */}
      {/* {results.suggestions.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center justify-start gap-2 border bg-card rounded-xl py-2 px-4">
          <p className="text-xs font-light text-foreground/80">
            You might also like :
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {results.suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  className="cursor-pointer text-foreground dark:text-white text-xs bg-white/5 hover:bg-white/10 rounded-full"
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )} */}

      {/* All Products Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {availableProducts
          .filter((product) => product.id !== results.bestMatch?.id)
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
      </div> */}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <div className="border w-full bg-card rounded-xl p-4">
      {/* Product Image and Main Info */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Product Image */}
        <div className="relative flex-shrink-0 border rounded-lg">
          <Image
            src={product.image || "/Home.png"}
            alt={product.name}
            width={200}
            height={200}
            className="h-40 object-cover rounded-lg bg-muted w-full"
            quality={95}
            onError={(e) => {
              e.currentTarget.src = "/Home.png";
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <span className="text-xs bg-gradient-to-b from-green-300 to-green-500 bg-clip-text text-transparent font-medium">
                  ✓ In Stock ({product.quantity} available)
                </span>
              ) : (
                <span className="text-xs text-red-600 font-medium">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Product Name and Brand */}
            <div className="space-y-1">
              <h1 className="text-base font-medium line-clamp-2">
                {product.name}
              </h1>
              <p className="text-xs text-foreground/80">{product.brand}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-foreground/80">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Product Description */}
          <div className="text-sm text-foreground/80 font-light">
            {product.description}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-2">
        {product.discount && (
          <div className="text-[10px] uppercase bg-white/10 text-white rounded-full px-2 py-1 w-fit">
            {product.discount}% OFF
          </div>
        )}
        <div className="flex items-start gap-3">
          <span className="font-bold text-3xl bg-gradient-to-b from-green-300 to-green-600 bg-clip-text text-transparent">
            {formatCurrencyShort(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm md:text-base text-foreground/80 line-through">
              {formatCurrencyShort(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="flex items-center gap-10 text-sm text-foreground/80 pt-2 pb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">
            {" "}
            {product.warehouse.estimatedDelivery}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{product.warehouse.distance} mi</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="px-3 text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              setQuantity((q) => Math.min(product.quantity, q + 1))
            }
            disabled={quantity >= product.quantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Button
          className="flex-1"
          onClick={() => onAddToCart({ ...product, quantity })}
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart ({quantity})
        </Button>
      </div>
    </div>
  );
};
