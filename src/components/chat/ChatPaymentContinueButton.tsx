import { Button } from "@/components/ui/button";

interface ChatPaymentContinueButtonProps {
  selectedWallet: string;
  WALLET_OPTIONS: any[];
  calculateTotal: () => number;
  formatCurrency: (n: number) => string;
  placeOrder: () => void;
}

export function ChatPaymentContinueButton({
  selectedWallet,
  WALLET_OPTIONS,
  calculateTotal,
  formatCurrency,
  placeOrder,
}: ChatPaymentContinueButtonProps) {
  if (!selectedWallet) return null;
  const wallet = WALLET_OPTIONS.find((w) => w.id === selectedWallet);
  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border">
      <Button
        className="w-full bg-walmart-true-blue hover:bg-walmart-bentonville-blue text-white"
        size="lg"
        onClick={placeOrder}
      >
        Continue with {wallet?.name} - ₹{formatCurrency(calculateTotal())}
      </Button>
    </div>
  );
}
