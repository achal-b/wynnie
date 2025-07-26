import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { FaIndianRupeeSign } from "react-icons/fa6";

interface ChatOrderSummaryProps {
  getTotalItems: () => number;
  getTotalPrice: () => number;
  selectedCoupons: string[];
  HARDCODED_COUPONS: any[];
  calculateTotal: () => number;
}

export function ChatOrderSummary({
  getTotalItems,
  getTotalPrice,
  selectedCoupons,
  HARDCODED_COUPONS,
  calculateTotal,
}: ChatOrderSummaryProps) {
  return (
    <Card className="px-4 py-2 gap-3 bg-transparent border shadow-white/50 text-white">
      <h1 className="text-base font-semibold text-white ">Order Summary</h1>
      <CardContent className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/80">
            Items ({getTotalItems()})
          </span>
          <span className="text-sm font-medium flex items-center gap-1">
            <FaIndianRupeeSign className="scale-90" />
            {formatCurrency(getTotalPrice())}
          </span>
        </div>
        {selectedCoupons.length > 0 && (
          <div className="flex justify-between items-center">
              <span className="text-sm text-white/80">Coupon Savings</span>
            <span className="text-sm text-green-300 font-medium flex items-center gap-1">
              <FaIndianRupeeSign className="scale-90" />
              -
              {formatCurrency(
                selectedCoupons.reduce((total, couponId) => {
                  const coupon = HARDCODED_COUPONS.find(
                    (c) => c.id === couponId
                  );
                  if (!coupon) return total;
                  
                  const cartTotal = getTotalPrice();
                  if (coupon.type === "percentage") {
                    return total + (cartTotal * coupon.discount / 100);
                  } else if (coupon.type === "fixed") {
                    return total + coupon.discount;
                  } else if (coupon.type === "shipping") {
                    return total + coupon.discount;
                  }
                  
                  return total;
                }, 0)
              )}
            </span>
          </div>
        )}
        <div className="border-t border-border pt-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-base text-white">Total</span>
            <span className="font-semibold text-base text-white flex items-center gap-1">
              <FaIndianRupeeSign className="scale-90" />
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
