import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface InlineCartSummaryProps {
  isVisible: boolean;
  items: CartItem[];
  getTotalItems: () => number;
  getTotalPrice: () => number;
  onClose: () => void;
  onOpenFullCart: () => void;
  onCheckout: () => void;
}

export const InlineCartSummary = ({
  isVisible,
  items,
  getTotalItems,
  getTotalPrice,
  onClose,
  onOpenFullCart,
  onCheckout,
}: InlineCartSummaryProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3"
    >
      <Card className="bg-card border border-border shadow-lg rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-card-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <p>Cart Summary ({getTotalItems()} items)</p>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-foreground/80 hover:bg-muted"
            >
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="max-h-32 overflow-y-auto space-y-2">
            {items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm text-card-foreground"
              >
                <span className="flex-1 truncate">{item.name}</span>
                <span className="text-xs text-foreground/80">
                  x{item.quantity}
                </span>
                <span className="ml-5 font-medium">
                  ₹{formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
            {items.length > 3 && (
              <div className="text-xs text-foreground/80 text-center">
                +{items.length - 3} more items...
              </div>
            )}
          </div>
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between font-semibold text-card-foreground">
              <span>Total:</span>
              <span>₹{formatCurrency(getTotalPrice())}</span>
            </div>
          </div>
          <div className="flex gap-10 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border text-card-foreground hover:bg-muted"
              onClick={onOpenFullCart}
            >
              Open Full Cart
            </Button>
            <Button
              size="sm"
              variant="default"
              className="flex-1"
              onClick={onCheckout}
            >
              Checkout
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
