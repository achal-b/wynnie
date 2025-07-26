"use client";
import { useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { ChevronDown, X, Copy, ChevronUp } from "lucide-react";

interface Coupon {
  code: string;
  type: "percent" | "fixed" | "freeship";
  value: number;
  discount: string;
  description: string;
}

interface CartCouponProps {
  subtotal: number;
  deliveryFee: number;
  appliedCoupon: { code: string; discount: number } | null;
  onApplyCoupon: (coupon: { code: string; discount: number } | null) => void;
}

export function CartCoupon({
  subtotal,
  deliveryFee,
  appliedCoupon,
  onApplyCoupon,
}: CartCouponProps) {
  const [couponCode, setCouponCode] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);

  const availableCoupons: Coupon[] = [
    {
      code: "SAVE10",
      type: "percent",
      value: 10,
      discount: "10% off",
      description: "Save 10% on your order",
    },
    {
      code: "FIRST50",
      type: "fixed",
      value: 50,
      discount: "₹50 off",
      description: "Get ₹50 off your first order",
    },
    {
      code: "FREESHIP",
      type: "freeship",
      value: 40,
      discount: "Free shipping",
      description: "Free delivery on any order",
    },
    {
      code: "WELCOME20",
      type: "percent",
      value: 20,
      discount: "20% off",
      description: "Welcome discount for new users",
    },
    {
      code: "FLASH25",
      type: "percent",
      value: 25,
      discount: "25% off",
      description: "Flash sale - limited time",
    },
  ];

  const applyCoupon = () => {
    const found = availableCoupons.find(
      (c) => c.code === couponCode.toUpperCase().trim()
    );
    if (!found) return;

    if (found.type === "percent") {
      onApplyCoupon({
        code: found.code,
        discount: Math.min(100, subtotal * (found.value / 100)),
      });
    } else if (found.type === "fixed") {
      onApplyCoupon({
        code: found.code,
        discount: found.value,
      });
    } else if (found.type === "freeship") {
      onApplyCoupon({
        code: found.code,
        discount: deliveryFee, // or 40
      });
    }
    // setCouponCode(""); // Do not clear the input after applying
  };

  const removeCoupon = () => {
    onApplyCoupon(null);
  };

  return (
    <div className="space-y-3 font-light  ">
      {/* Coupon Input and Apply */}
      <div className="flex gap-3">
        <input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="flex-1 bg-muted/50 border-muted rounded px-3 py-2 text-sm font-light outline-none"
        />
        <button
          onClick={applyCoupon}
          disabled={!couponCode}
          className="bg-muted/50 rounded px-4 py-2 text-sm font-medium border border-muted-foreground/10 hover:bg-muted/80 disabled:opacity-50"
        >
          Apply
        </button>
      </div>
      <div
        className="flex items-center justify-between text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg cursor-pointer group"
        title="Show all coupons"
        role="button"
        tabIndex={0}
        onClick={() => setShowCouponModal(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowCouponModal(true);
        }}
      >
        <span className="text-xs font-medium tracking-wide uppercase">
          💡 Available Coupons
        </span>
        {showCouponModal ? (
          <ChevronUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
        ) : (
          <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
        )}
      </div>

      {/* Applied Coupon */}
      {appliedCoupon && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Copy className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              {appliedCoupon.code} Applied
            </span>
          </div>
          <button
            type="button"
            className="h-6 w-6 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded flex items-center justify-center"
            onClick={removeCoupon}
            title="Remove coupon"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCouponModal(false)}
          />
          {/* Modal */}
          <div className="relative bg-background rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-10 animate-in fade-in-0 zoom-in-95">
            <button
              type="button"
              className="absolute top-3 right-3 text-foreground/80 hover:text-foreground p-1 rounded hover:bg-muted"
              onClick={() => setShowCouponModal(false)}
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-base font-semibold mb-4">
              Available Coupons
            </div>
            <div className="space-y-2">
              {availableCoupons.map((coupon, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-background/50 rounded border cursor-pointer group hover:bg-white/5 transition"
                  onClick={() => {
                    setCouponCode(coupon.code); // Set the input to the selected coupon code
                    // Apply the coupon immediately on click
                    if (coupon.type === "percent") {
                      onApplyCoupon({
                        code: coupon.code,
                        discount: Math.min(
                          100,
                          subtotal * (coupon.value / 100)
                        ),
                      });
                    } else if (coupon.type === "fixed") {
                      onApplyCoupon({
                        code: coupon.code,
                        discount: coupon.value,
                      });
                    } else if (coupon.type === "freeship") {
                      onApplyCoupon({
                        code: coupon.code,
                        discount: deliveryFee,
                      });
                    }
                    setShowCouponModal(false);
                  }}
                  title={`Copy ${coupon.code}`}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setCouponCode(coupon.code); // Set the input to the selected coupon code
                      if (coupon.type === "percent") {
                        onApplyCoupon({
                          code: coupon.code,
                          discount: Math.min(
                            100,
                            subtotal * (coupon.value / 100)
                          ),
                        });
                      } else if (coupon.type === "fixed") {
                        onApplyCoupon({
                          code: coupon.code,
                          discount: coupon.value,
                        });
                      } else if (coupon.type === "freeship") {
                        onApplyCoupon({
                          code: coupon.code,
                          discount: deliveryFee,
                        });
                      }
                      setShowCouponModal(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="h-6 w-6 p-0 flex-shrink-0 flex items-center justify-center rounded group-hover:bg-muted">
                      <Copy className="h-3 w-3 text-foreground/80 group-hover:text-primary" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 justify-between">
                        <span className=" font-medium text-primary text-sm tracking-wider">
                          {coupon.code}
                        </span>
                        <span className=" text-green-500 text-xs font-light">
                          {coupon.discount}
                        </span>
                      </div>
                      <div className="text-foreground/80 text-xs truncate font-light">
                        {coupon.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
