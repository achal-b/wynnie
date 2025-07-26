"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  MapPin,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = [
  {
    id: "upi",
    name: "UPI Payment",
    icon: Smartphone,
    description: "PhonePe, Google Pay, BHIM",
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, RuPay",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    icon: Building2,
    description: "All major banks",
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: Wallet,
    description: "PayPal, Amazon Pay",
  },
];

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<
    "address" | "payment" | "processing" | "success"
  >("address");
  const [selectedPayment, setSelectedPayment] = useState("upi");

  const total = getTotalPrice();
  const deliveryFee = total > 500 ? 0 : 40;
  const finalTotal = total + deliveryFee;

  const handleAddressNext = () => {
    setStep("payment");
  };

  const handlePayment = async () => {
    setStep("processing");

    // Simulate payment processing
    setTimeout(() => {
      setStep("success");
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
        onOpenChange(false);
        setStep("address"); // Reset for next time
      }, 3000);
    }, 3000);
  };

  const handleClose = () => {
    if (step !== "processing") {
      onOpenChange(false);
      setStep("address");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        data-lenis-prevent
      >
        <DialogHeader>
          <DialogTitle>
            {step === "address" && "Delivery Address"}
            {step === "payment" && "Payment Method"}
            {step === "processing" && "Processing Payment"}
            {step === "success" && "Order Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        {step === "address" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium">Home</h3>
                    <p className="text-sm text-foreground/80">
                      123 Main Street, Apt 4B
                      <br />
                      New York, NY 10001
                      <br />
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="instructions">
                Delivery Instructions (Optional)
              </Label>
              <Input
                id="instructions"
                placeholder="e.g., Leave at door, Ring bell twice"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <Button onClick={handleAddressNext} className="w-full">
              Continue to Payment
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <RadioGroup
              value={selectedPayment}
              onValueChange={setSelectedPayment}
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex items-center gap-3 flex-1">
                    <method.icon className="h-5 w-5 text-primary" />
                    <div>
                      <Label
                        htmlFor={method.id}
                        className="font-medium cursor-pointer"
                      >
                        {method.name}
                      </Label>
                      <p className="text-xs text-foreground/80">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {selectedPayment === "card" && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                  <div>
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                </div>
              </div>
            )}

            {selectedPayment === "upi" && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input id="upiId" placeholder="yourname@paytm" />
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span>Amount to Pay</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("address")}
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={handlePayment} className="flex-1">
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-foreground/80">
              Please wait while we process your payment...
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">Amount: ₹{finalTotal.toLocaleString()}</p>
              <p className="text-sm">
                Method:{" "}
                {paymentMethods.find((m) => m.id === selectedPayment)?.name}
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-foreground/80 mb-4">
              Your order has been placed successfully
            </p>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg mb-4">
              <p className="text-sm font-medium">
                Order ID: #ORD-{Date.now().toString().slice(-6)}
              </p>
              <p className="text-sm">
                Amount Paid: ₹{finalTotal.toLocaleString()}
              </p>
              <p className="text-sm">Estimated Delivery: Tomorrow, 2-4 PM</p>
            </div>
            <p className="text-xs text-foreground/80">
              You will receive a confirmation email shortly
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
