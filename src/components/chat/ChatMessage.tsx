import { motion } from "motion/react";
import { Message } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Flow2ProductResults } from "@/components/Flow2ProductResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import {
  ShoppingCart,
  TrendingDown,
  Truck,
  Leaf,
  Star,
  DollarSign,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency, formatCurrencyShort } from "@/lib/currency";
import { HARDCODED_COUPONS, WALLET_OPTIONS } from "@/lib/constants";
import React from "react";
import { ChatPaymentSecurityBanner } from "@/components/chat/ChatPaymentSecurityBanner";
import { ChatOrderSummary } from "@/components/chat/ChatOrderSummary";
import { ChatPaymentMethods } from "@/components/chat/ChatPaymentMethods";
import { ChatPaymentContinueButton } from "@/components/chat/ChatPaymentContinueButton";
import { CouponSearch } from "@/components/chat/CouponSearch";
import { TimerCountdown } from "@/components/chat/TimerCountdown";
import { CartOptimizationResults } from "@/components/chat/CartOptimizationResults";
import { DeliveryOptimizationResults } from "@/components/chat/DeliveryOptimizationResults";
import { PaymentConfirmationDialog } from "@/components/chat/PaymentConfirmationDialog";
import { OrderConfirmation } from "@/components/chat/OrderConfirmation";
import { InlineCartSummary } from "@/components/chat/InlineCartSummary";
import { FormattedMessageContent } from "@/components/chat/FormattedMessageContent";
import { ChatPaymentSection } from "@/components/chat/ChatPaymentSection";

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}

export const ChatMessage = ({
  message,
  isLastMessage = false,
}: ChatMessageProps) => {
  const { addToCart, items, getTotalItems, getTotalPrice } = useCart();
  const [showCartSummary, setShowCartSummary] = useState(false);
  const [showProducts, setShowProducts] = useState(true);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [flow2TimerCompleted, setFlow2TimerCompleted] = useState(false);
  const [showCouponSearch, setShowCouponSearch] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  // Debug: Log message data
  console.log("🔍 ChatMessage render:", {
    messageId: message.id,
    isLastMessage,
    hasProducts: !!message.products?.length,
    hasFlow2: !!message.flow2Results,
    content: message.content?.substring(0, 50),
    showTimer,
    showProducts,
  });

  const handleAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    brand?: string;
    category?: string;
    rating?: number;
  }) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      product: product as any, // Type assertion for compatibility
    });
  };

  const handleViewDetails = (product: { id: string; name: string }) => {
    console.log("View product details:", product);
    // TODO: Implement product details modal or navigation
  };

  // Start timer when products are actually displayed (either real products or Flow2 results)
  useEffect(() => {
    if (
      ((message.products && message.products.length > 0) ||
        message.flow2Results) &&
      isLastMessage
    ) {
      console.log("🔥 STARTING TIMER - Last message with products:", {
        products: message.products?.length,
        flow2Results: !!message.flow2Results,
        isLastMessage,
        messageId: message.id,
      });
      setShowTimer(true);
      setShowProducts(true);
    } else {
      console.log("❌ Timer NOT starting:", {
        hasProducts: !!(message.products && message.products.length > 0),
        hasFlow2: !!message.flow2Results,
        isLastMessage,
        messageId: message.id,
      });
    }
  }, [message.products, message.flow2Results, isLastMessage, message.id]);

  // Handle Flow2 timer completion
  const handleFlow2TimerComplete = () => {
    setFlow2TimerCompleted(true);
    // Auto-proceed to coupon search when Flow2 timer expires
    setShowCouponSearch(true);

    // Log that product was auto-added (notification handled in Flow2ProductResults)
    if (
      message.flow2Results?.products &&
      message.flow2Results.products.length > 0
    ) {
      const bestMatchProduct = message.flow2Results.products[0];
      console.log("✅ Product Auto-Added to Cart:", bestMatchProduct.name);
    }
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
    setShowProducts(false);
    setShowCouponSearch(true);
  };

  const handleCancelSelection = () => {
    setShowTimer(false);
    setShowProducts(false);
  };

  const proceedToCoupons = () => {
    setShowTimer(false);
    setShowProducts(false);
    setShowCouponSearch(true);
  };

  const handleCouponsApplied = (coupons: string[]) => {
    setSelectedCoupons(coupons);
    setShowCouponSearch(false);
    setShowPayment(true);
  };

  const handleSkipCoupons = () => {
    setShowCouponSearch(false);
    setShowPayment(true);
  };

  const handleCancelCoupons = () => {
    setShowCouponSearch(false);
    setShowProducts(true);
    setSelectedCoupons([]);
  };

  const selectWallet = (walletId: string) => {
    setSelectedWallet(walletId);
  };

  const placeOrder = () => {
    setShowPayment(false);
    setShowOrderConfirmation(true);
  };

  const confirmPayment = () => {
    setShowPaymentConfirmation(false);
    setShowOrderConfirmation(true);
  };

  const calculateTotal = () => {
    const cartTotal = getTotalPrice();
    const couponSavings = selectedCoupons.reduce((total, couponId) => {
      const coupon = HARDCODED_COUPONS.find((c) => c.id === couponId);
      if (!coupon) return total;

      if (coupon.type === "percentage") {
        return total + (cartTotal * coupon.discount) / 100;
      } else if (coupon.type === "fixed") {
        return total + coupon.discount;
      } else if (coupon.type === "shipping") {
        return total + coupon.discount;
      }

      return total;
    }, 0);
    return Math.max(0, cartTotal - couponSavings);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {message.content && (
        <div
          className={`flex ${
            message.isUser ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`rounded-lg px-4 py-1 ${
              message.isUser
                ? "bg-primary text-primary-foreground max-w-[70%] "
                : message.isSystemMessage
                ? "bg-accent/20 border border-accent/30 text-accent-foreground"
                : "bg-muted text-foreground/80"
            }`}
          >
            <FormattedMessageContent
              content={message.content}
              isUser={message.isUser}
              isSystemMessage={message.isSystemMessage}
            />
          </motion.div>
        </div>
      )}

      {/* Cart Optimization Results */}
      {message.optimizationData?.type === "cart" && (
        <CartOptimizationResults
          optimizationData={message.optimizationData}
          onApplyOptimization={() => {
            console.log("Apply optimization clicked");
          }}
        />
      )}

      {/* Delivery Optimization Results */}
      {message.optimizationData?.type === "delivery" && (
        <DeliveryOptimizationResults
          optimizationData={message.optimizationData}
        />
      )}

      {/* Cart Action Messages */}
      {message.cartData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3"
        >
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-card-foreground">
                  Cart Updated
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setShowCartSummary(!showCartSummary)}
                >
                  {showCartSummary ? "Hide Cart" : "View Cart"}
                </Button>
                {message.cartData.cartSummary?.totalItems >= 3 && (
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      // Trigger checkout flow by opening the cart modal from header
                      const cartIcon = document.querySelector(
                        "[data-cart-trigger]"
                      ) as HTMLElement;
                      if (cartIcon) {
                        cartIcon.click();
                      } else {
                        // Fallback: show checkout summary in chat
                        setShowCartSummary(true);
                      }
                    }}
                  >
                    Checkout Now
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Flow 2 Product Search Results */}
      {message.flow2Results && isLastMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3"
        >
          <Flow2ProductResults
            results={message.flow2Results}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onTimerComplete={handleFlow2TimerComplete}
          />

          {/* Timer Header for Flow2 Results - BELOW products */}
        </motion.div>
      )}

      {/* Products with Timer (only show when we have actual products) */}
      {message.products && showProducts && isLastMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3"
        >
          {/* Show actual products FIRST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {message.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>

          {/* Timer Countdown */}
          <TimerCountdown
            isVisible={showTimer}
            initialTime={20}
            onTimerComplete={handleTimerComplete}
            onCancel={handleCancelSelection}
            showCancelButton={true}
            title="⏰ Limited Time Offer"
            subtitle="Products will be hidden soon to make room for new deals"
          />
        </motion.div>
      )}

      {/* Coupon Search Component */}
      {showCouponSearch && flow2TimerCompleted && (
        <CouponSearch
          isVisible={showCouponSearch}
          onCouponsApplied={handleCouponsApplied}
          onSkipCoupons={handleSkipCoupons}
          onCancel={handleCancelCoupons}
          autoSelectDefault={true}
        />
      )}

      {/* Payment Options */}
      {showPayment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3"
        >
          <ChatPaymentSection
            getTotalItems={getTotalItems}
            getTotalPrice={getTotalPrice}
            selectedCoupons={selectedCoupons}
            HARDCODED_COUPONS={HARDCODED_COUPONS}
            calculateTotal={calculateTotal}
            WALLET_OPTIONS={WALLET_OPTIONS}
            selectedWallet={selectedWallet}
            selectWallet={selectWallet}
            onSlidePay={() => {
              setShowPayment(false);
              setShowOrderConfirmation(true);
            }}
            isSlideDisabled={false}
            onClose={() => setShowPayment(false)}
          />
        </motion.div>
      )}

      {/* Payment Confirmation Dialog */}
      {/* <PaymentConfirmationDialog
        isVisible={showPaymentConfirmation && !showCouponSearch}
        selectedWallet={selectedWallet}
        walletOptions={WALLET_OPTIONS}
        calculateTotal={calculateTotal}
        onConfirm={confirmPayment}
        onCancel={() => setShowPaymentConfirmation(false)}
        selectedCoupons={selectedCoupons}
      /> */}

      {/* Order Confirmation */}
      <OrderConfirmation
        isVisible={showOrderConfirmation && !showCouponSearch}
        selectedWallet={selectedWallet}
        walletOptions={WALLET_OPTIONS}
        calculateTotal={calculateTotal}
        onStartNewOrder={() => {
          setShowOrderConfirmation(false);
          setShowProducts(true);
          setShowCouponSearch(false);
          setSelectedCoupons([]);
          setSelectedWallet("");
        }}
      />

      {/* Inline Cart Summary triggered from chat */}
      <InlineCartSummary
        isVisible={showCartSummary && !!message.cartData}
        items={items}
        getTotalItems={getTotalItems}
        getTotalPrice={getTotalPrice}
        onClose={() => setShowCartSummary(false)}
        onOpenFullCart={() => {
          // Open main cart modal
          const cartIcon = document.querySelector(
            "[data-cart-trigger]"
          ) as HTMLElement;
          if (cartIcon) cartIcon.click();
        }}
        onCheckout={() => {
          // Trigger checkout
          const cartIcon = document.querySelector(
            "[data-cart-trigger]"
          ) as HTMLElement;
          if (cartIcon) {
            cartIcon.click();
            // After a brief delay, try to click checkout button
            setTimeout(() => {
              const checkoutBtn = document.querySelector(
                "[data-checkout-trigger]"
              ) as HTMLElement;
              if (checkoutBtn) checkoutBtn.click();
            }, 500);
          }
        }}
      />
    </motion.div>
  );
};
