import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { PaymentSlideButton } from "@/components/ui/payment-slide-button";
import SlideToPay from "@/components/ui/slide-to-pay";
import { formatCurrency } from "@/lib/currency";
import { FaCreditCard } from "react-icons/fa6";

interface WalletOption {
  id: string;
  name: string;
}

interface PaymentConfirmationDialogProps {
  isVisible: boolean;
  selectedWallet: string;
  walletOptions: WalletOption[];
  calculateTotal: () => number;
  onConfirm: () => void;
  onCancel: () => void;
  selectedCoupons: string[];
}

export const PaymentConfirmationDialog = ({
  isVisible,
  selectedWallet,
  walletOptions,
  calculateTotal,
  onConfirm,
  onCancel,
  selectedCoupons,
}: PaymentConfirmationDialogProps) => {
  if (!isVisible) return null;

  const selectedWalletData = walletOptions.find((w) => w.id === selectedWallet);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-3"
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl">
              <FaCreditCard />
            </div>
          </div>

          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            Confirm Payment
          </h3>

          <p className="text-blue-700 dark:text-blue-300 mb-4">
            You are about to pay{" "}
            <strong>₹{formatCurrency(calculateTotal())}</strong> using{" "}
            <strong>{selectedWalletData?.name}</strong>
          </p>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Order Total:</span>
                <span>₹{formatCurrency(calculateTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>{selectedWalletData?.name}</span>
              </div>
              {selectedCoupons.length > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Applied:</span>
                  <span>20% OFF (WELCOME20)</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <SlideToPay
              amount={calculateTotal()}
              currencySymbol={formatCurrency(0).replace(/\d|\./g, "")}
              label="Slide to Pay"
              onComplete={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                onConfirm();
              }}
              disabled={false}
            />
            <Button variant="outline" onClick={onCancel} className="w-full">
              Cancel Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
