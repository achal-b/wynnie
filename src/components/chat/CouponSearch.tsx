import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HARDCODED_COUPONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/currency";
import { AnimatedCard, LoadingSpinner, ProgressBar } from "./shared";
import { motion, AnimatePresence } from "framer-motion";

interface CouponSearchProps {
  isVisible: boolean;
  onCouponsApplied: (selectedCoupons: string[]) => void;
  onSkipCoupons: () => void;
  onCancel?: () => void;
  autoSelectDefault?: boolean;
}

export const CouponSearch = ({
  isVisible,
  onCouponsApplied,
  onSkipCoupons,
  onCancel,
  autoSelectDefault = true,
}: CouponSearchProps) => {
  const [searchingCoupons, setSearchingCoupons] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [couponTimeLeft, setCouponTimeLeft] = useState(10);
  const [couponTimerActive, setCouponTimerActive] = useState(false);
  const isCancelledRef = useRef(false);

  // Start coupon search when component becomes visible or re-visible
  useEffect(() => {
    if (isVisible) {
      isCancelledRef.current = false;
      setSearchingCoupons(true);
      setShowCoupons(false);
      setSelectedCoupons([]);
      setCouponTimerActive(false);
      setCouponTimeLeft(10);

      const searchTimeout = setTimeout(() => {
        if (!isCancelledRef.current) {
          setSearchingCoupons(false);
          setShowCoupons(true);

          if (autoSelectDefault) {
            setSelectedCoupons(["WELCOME20"]); // Auto-select 20% off coupon
          }

          setCouponTimerActive(true);
          setCouponTimeLeft(10);
        }
      }, 2000);

      return () => clearTimeout(searchTimeout);
    } else {
      // Reset all states when component becomes invisible
      isCancelledRef.current = true;
      setSearchingCoupons(false);
      setShowCoupons(false);
      setSelectedCoupons([]);
      setCouponTimerActive(false);
      setCouponTimeLeft(10);
    }
  }, [isVisible, autoSelectDefault]);

  // Coupon timer countdown effect
  useEffect(() => {
    if (couponTimerActive && couponTimeLeft > 0 && !isCancelledRef.current) {
      const timer = setTimeout(() => {
        if (!isCancelledRef.current) {
          setCouponTimeLeft(couponTimeLeft - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (couponTimeLeft === 0 && !isCancelledRef.current) {
      setCouponTimerActive(false);
      // Auto-proceed to payment when coupon timer expires
      handleApplyCoupons();
    }
  }, [couponTimerActive, couponTimeLeft]);

  const selectCoupon = (couponId: string) => {
    setSelectedCoupons((prev) =>
      prev.includes(couponId)
        ? prev.filter((id) => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleApplyCoupons = () => {
    setCouponTimerActive(false);
    setShowCoupons(false);
    onCouponsApplied(selectedCoupons);
  };

  const handleSkipCoupons = () => {
    setCouponTimerActive(false);
    setShowCoupons(false);
    onSkipCoupons();
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    setCouponTimerActive(false);
    setShowCoupons(false);
    setSearchingCoupons(false);
    setSelectedCoupons([]);
    setCouponTimeLeft(10);
    onCancel?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-neutral-900 rounded-t-2xl shadow-2xl border-t border-muted max-h-[90vh] overflow-y-auto"
          style={{ minHeight: 320 }}
        >
          <div className="w-full max-w-md mx-auto p-4">
            {/* Drag handle */}
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>
            {/* Searching for Coupons Loading */}
            {searchingCoupons && (
              <AnimatedCard
                gradient="warning"
                className="mt-3"
                cardClassName="p-6 text-center"
              >
                <LoadingSpinner
                  icon="🔍"
                  title="Searching for the best coupons..."
                  subtitle="Finding you the best deals and discounts available!"
                  size="md"
                  variant="search"
                />
                {/* Cancel Button during search */}
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="bg-muted/50 border-muted-foreground/10 hover:bg-muted/80"
                  >
                    Cancel Search
                  </Button>
                </div>
              </AnimatedCard>
            )}
            {/* Coupon Search Results */}
            {showCoupons && (
              <AnimatedCard
                className="mt-3 space-y-3 font-light"
                cardClassName="p-0"
              >
                {/* Header Section */}
                <div className="flex items-center justify-between text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg">
                  <span className="text-xs font-medium tracking-wide uppercase">
                    🎟️ Available Coupons
                  </span>
                  {couponTimerActive && (
                    <div className="text-xs bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full">
                      ⏰ Auto-applying in {couponTimeLeft}s
                    </div>
                  )}
                </div>
                {/* Timer Progress Bar */}
                {couponTimerActive && (
                  <ProgressBar
                    progress={1 - couponTimeLeft / 10}
                    variant="warning"
                    height="sm"
                    className="px-3"
                  />
                )}
                {/* Coupon List */}
                <div className="space-y-2">
                  {HARDCODED_COUPONS.filter((coupon) => coupon.applicable).map(
                    (coupon) => (
                      <div
                        key={coupon.id}
                        className={`flex items-center justify-between p-3 bg-background/50 rounded border cursor-pointer group hover:bg-white/5 transition ${
                          selectedCoupons.includes(coupon.id)
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : "border-muted hover:border-yellow-300"
                        }`}
                        onClick={() => selectCoupon(coupon.id)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="h-6 w-6 p-0 flex-shrink-0 flex items-center justify-center rounded group-hover:bg-muted">
                            <span className="text-xs">🎫</span>
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 justify-between mb-1">
                              <span className="font-medium text-primary text-sm tracking-wider">
                                {coupon.id}
                              </span>
                              <span className=" text-green-500 text-xs font-light">
                                {coupon.type === "percentage"
                                  ? `${coupon.discount}% off`
                                  : coupon.type === "fixed"
                                  ? `₹${coupon.discount} off`
                                  : "Free shipping"}
                              </span>
                            </div>
                            <div className="text-foreground/80 text-xs truncate font-light mb-1">
                              {coupon.description}
                            </div>
                            <div className="text-foreground/60 text-xs font-light">
                              Min: {formatCurrency(coupon.minOrderValue)} |
                              Expires: {coupon.expiryDate}
                            </div>
                          </div>
                        </div>
                        {selectedCoupons.includes(coupon.id) && (
                          <Badge className="bg-green-500 text-white text-xs ml-2 flex-shrink-0">
                            Selected
                          </Badge>
                        )}
                      </div>
                    )
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-muted">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 bg-muted/50 border-muted-foreground/10 hover:bg-muted/80"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSkipCoupons}
                    className="flex-1 bg-muted/50 border-muted-foreground/10 hover:bg-muted/80"
                  >
                    Skip Coupons
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyCoupons}
                    className="flex-1 bg-muted/50 border-muted-foreground/10 hover:bg-muted/80"
                  >
                    Apply & Continue to Payment
                  </Button>
                </div>
              </AnimatedCard>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
