"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  X,
  Package,
  Truck,
  Zap,
  DollarSign,
  Leaf,
  TrendingDown,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { CheckoutModal } from "@/components/CheckoutModal";
import { formatCurrency, formatCurrencyShort } from "@/lib/currency";
import Image from "next/image";
import { CartCoupon } from "@/components/ui/cart-coupon";
import { FaIndianRupeeSign } from "react-icons/fa6";

export function CartModal() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    clearCart,
    cartOptimization,
    deliveryOptimization,
    isOptimizing,
    optimizeCart,
    optimizeDelivery,
    applyOptimization,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "123 Main St",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
  });
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const deliveryFee = subtotal > 500 ? 0 : 0.58;
  const total = subtotal - discount + deliveryFee;

  // Calculate optimization savings
  const optimizationSavings = cartOptimization?.totalSavings || 0;
  const finalTotal = total - optimizationSavings;

  // Remove applyCoupon and removeCoupon functions, as CartCoupon will handle them

  const handleOptimizeCart = async () => {
    setShowOptimizations(true);
    await optimizeCart();
  };

  const handleOptimizeDelivery = async () => {
    await optimizeDelivery(deliveryAddress);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setShowCheckout(true);
  };

  return (
    <div className="relative font-light">
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-muted/50"
            data-cart-trigger
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-xs font-light bg-walmart-true-blue text-white border-0">
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0 bg-background border-l border-border">
          <SheetHeader className="px-6 py-4 border-b border-border bg-card w-full">
            <SheetTitle className="text-xl font-semibold text-card-foreground">
              My cart
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6 bg-background">
              <div className="text-center space-y-4">
                <div className="p-4 rounded-full bg-muted/50 w-20 h-20 mx-auto flex items-center justify-center">
                  <Package className="h-10 w-10 text-foreground/80" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-foreground">
                    Your cart is empty
                  </h3>
                  <p className="text-foreground/80 text-sm">
                    Add some products to get started
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Main scrollable content area
            <div
              className="flex-1 overflow-y-auto bg-background"
              data-lenis-prevent
            >
              {/* Cart Items */}
              <div className="max-h-66 overflow-y-auto px-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 border-b border-border/50 last:border-b-0"
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={item.image || "/Home.png"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg bg-muted border border-border"
                        priority
                        quality={95}
                        onError={(e) => {
                          e.currentTarget.src = `/Home.png`;
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      <h4 className="text-sm line-clamp-2 leading-tight mb-1 text-foreground font-medium">
                        {item.name}
                      </h4>
                      <p className="text-sm line-clamp-3 text-walmart-true-blue dark:text-walmart-everyday-blue leading-tight mb-1 font-semibold">
                        ₹
                        {Math.round(
                          Number(
                            formatCurrencyShort(item.price).replace(
                              /[^\d.]/g,
                              ""
                            )
                          )
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-muted/30 rounded-full border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-muted/50 text-foreground"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-base font-medium min-w-[2rem] text-center text-card-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-muted/50 text-foreground"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Results */}
              <div className="border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="px-6 py-4 space-y-6">
                  {/* Coupon Section */}
                  <CartCoupon
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    appliedCoupon={appliedCoupon}
                    onApplyCoupon={setAppliedCoupon}
                  />

                  {/* Flow 3 & 4 Optimization Section */}
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-start gap-3 md:justify-between">
                      <h3 className="font-medium text-sm uppercase tracking-wide text-card-foreground">
                        Smart Optimizations
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOptimizeCart}
                          disabled={isOptimizing}
                          className="bg-muted/30 border-border hover:bg-muted/50 text-foreground"
                        >
                          {isOptimizing ? (
                            <>
                              <Zap className="h-4 w-4 mr-2 animate-spin text-walmart-spark-yellow" />
                              Optimizing...
                            </>
                          ) : (
                            <>
                              <FaIndianRupeeSign className="h-4 w-4 mr-2 text-walmart-true-blue" />
                              Find Savings
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOptimizeDelivery}
                          disabled={isOptimizing}
                          className="bg-muted/30 border-border hover:bg-muted/50 text-foreground"
                        >
                          <Truck className="h-4 w-4 mr-2 text-walmart-true-blue" />
                          Delivery
                        </Button>
                      </div>
                    </div>

                    {/* Cart Optimization Results */}
                    {cartOptimization && (
                      <Card className="bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10 border-walmart-everyday-blue/30 dark:border-walmart-everyday-blue/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                            <TrendingDown className="h-4 w-4 text-walmart-true-blue" />
                            Cart Optimization Available!
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          <div className="text-sm text-foreground font-medium">
                            Save {formatCurrency(cartOptimization.totalSavings)}{" "}
                            ({cartOptimization.savingsPercentage.toFixed(1)}%)
                            with these alternatives:
                          </div>

                          {cartOptimization.recommendedSubstitutions
                            .slice(0, 2)
                            .map((sub, idx) => (
                              <div
                                key={idx}
                                className="text-sm bg-background dark:bg-card p-3 rounded-lg border border-border"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-foreground">
                                      {sub.suggestedProduct.name}
                                    </div>
                                    <div className="text-foreground/80 text-xs">
                                      {sub.reason}
                                    </div>
                                  </div>
                                  <div className="text-foreground font-medium">
                                    -{formatCurrency(sub.savings)}
                                  </div>
                                </div>
                              </div>
                            ))}

                          {cartOptimization.recommendedSubstitutions.length >
                            2 && (
                            <div className="text-sm text-foreground font-medium">
                              +
                              {cartOptimization.recommendedSubstitutions
                                .length - 2}{" "}
                              more savings available
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => applyOptimization("all")}
                              className="flex-1 bg-walmart-true-blue hover:bg-walmart-bentonville-blue text-white"
                            >
                              Apply All Savings
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setShowOptimizations(!showOptimizations)
                              }
                              className="border-border text-foreground hover:bg-muted/50"
                            >
                              {showOptimizations ? "Hide" : "Details"}
                            </Button>
                          </div>

                          {showOptimizations && (
                            <div className="pt-3 space-y-2 border-t border-border/50">
                              <div className="flex justify-between text-sm">
                                <span className="text-foreground/80">
                                  Sustainability Score:
                                </span>
                                <span className="flex items-center gap-1 text-foreground">
                                  <Leaf className="h-3 w-3 text-walmart-spark-yellow" />
                                  {cartOptimization.sustainabilityScore}%
                                </span>
                              </div>
                              {cartOptimization.rollbackOpportunities.length >
                                0 && (
                                <div className="text-sm">
                                  <span className="text-foreground font-medium">
                                    🔥{" "}
                                    {
                                      cartOptimization.rollbackOpportunities
                                        .length
                                    }{" "}
                                    Rollback deals available!
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Delivery Optimization Results */}
                    {deliveryOptimization && (
                      <Card className="bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10 border-walmart-everyday-blue/30 dark:border-walmart-everyday-blue/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                            <Truck className="h-4 w-4 text-walmart-true-blue" />
                            Delivery Optimized!
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-sm text-foreground font-medium">
                            Fastest delivery:{" "}
                            {
                              deliveryOptimization.recommendedDelivery
                                .estimatedTime
                            }
                          </div>
                          <div className="text-sm text-foreground">
                            <strong>Warehouse:</strong>{" "}
                            {deliveryOptimization.optimalWarehouse.name}
                          </div>
                          <div className="text-sm text-foreground">
                            <strong>Delivery Cost:</strong>{" "}
                            {formatCurrency(
                              deliveryOptimization.totalDeliveryCost
                            )}
                          </div>
                          <div className="text-sm text-foreground">
                            <strong>Tracking:</strong>{" "}
                            {
                              deliveryOptimization.lastMileCoordination
                                .trackingId
                            }
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm uppercase tracking-wide text-card-foreground">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/80 font-light text-sm">
                          Subtotal ({totalItems} items)
                        </span>
                        <span className="font-light text-sm text-foreground/80">
                          ₹
                          {Math.round(
                            Number(
                              formatCurrencyShort(subtotal).replace(
                                /[^\d.]/g,
                                ""
                              )
                            )
                          )}
                        </span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-foreground">
                          <span className="font-light text-sm">Discount</span>
                          <span className="font-light text-sm">
                            -₹
                            {Math.round(
                              Number(
                                formatCurrencyShort(discount).replace(
                                  /[^\d.]/g,
                                  ""
                                )
                              )
                            )}
                          </span>
                        </div>
                      )}

                      {optimizationSavings > 0 && (
                        <div className="flex justify-between text-sm text-foreground">
                          <span className="font-light text-sm">
                            Smart Optimization
                          </span>
                          <span className="font-light text-sm">
                            -₹
                            {Math.round(
                              Number(
                                formatCurrency(optimizationSavings).replace(
                                  /[^\d.]/g,
                                  ""
                                )
                              )
                            )}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/80 font-light text-sm">
                          Delivery Fee
                        </span>
                        <span className="font-light text-sm text-foreground/80">
                          {deliveryFee === 0
                            ? "FREE"
                            : "₹" +
                              Math.round(
                                Number(
                                  formatCurrencyShort(deliveryFee).replace(
                                    /[^\d.]/g,
                                    ""
                                  )
                                )
                              )}
                        </span>
                      </div>

                      <Separator className="bg-border" />

                      <div className="flex justify-between text-lg font-semibold">
                        <span className="font-medium text-sm uppercase tracking-wide text-foreground">
                          Total
                        </span>
                        <span className="font-medium text-sm uppercase tracking-wide text-foreground">
                          ₹{" "}
                          {Math.round(
                            Number(
                              formatCurrencyShort(finalTotal).replace(
                                /[^\d.]/g,
                                ""
                              )
                            )
                          )}
                        </span>
                      </div>

                      {optimizationSavings > 0 && (
                        <div className="text-sm text-center text-foreground bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10 p-3 rounded-lg border border-walmart-everyday-blue/20">
                          🎉 You're saving ₹
                          {Math.round(
                            Number(
                              formatCurrency(optimizationSavings).replace(
                                /[^\d.]/g,
                                ""
                              )
                            )
                          )}{" "}
                          with smart optimizations!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 grid grid-cols-[1fr_2fr] gap-3">
                    <Button
                      variant="outline"
                      className="w-full bg-muted/30 border-border hover:bg-muted/50 text-foreground dark:text-foreground"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                    <Button
                      className="w-full flex-1 text-base font-medium bg-walmart-true-blue hover:bg-walmart-bentonville-blue text-white cursor-pointer"
                      onClick={handleCheckout}
                      data-checkout-trigger
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutModal open={showCheckout} onOpenChange={setShowCheckout} />
    </div>
  );
}
