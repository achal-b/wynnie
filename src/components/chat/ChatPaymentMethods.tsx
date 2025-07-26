import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { FaIndianRupeeSign } from "react-icons/fa6";

interface ChatPaymentMethodsProps {
  WALLET_OPTIONS: any[];
  selectedWallet: string;
  selectWallet: (id: string) => void;
  calculateTotal: () => number;
}

export function ChatPaymentMethods({
  WALLET_OPTIONS,
  selectedWallet,
  selectWallet,
  calculateTotal,
}: ChatPaymentMethodsProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white">
        Choose Payment Method
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {WALLET_OPTIONS.map((wallet) => (
          <Card
            key={wallet.id}
            className={`cursor-pointer transition-all duration-200 border-border bg-transparent border-none shadow-none p-0 ${
              selectedWallet === wallet.id
                ? "bg-walmart-sky-blue/10 bg-gradient-to-r from-primary/5 to-primary/10 "
                : "hover:border-walmart-true-blue/30 hover:shadow-md hover:border-primary/20 "
            }`}
            onClick={() => selectWallet(wallet.id)}
          >
            <div className="flex items-center gap-3 col-span-2 py-2">
              <div className={`border border-white/10 rounded-sm p-1 text-black bg-white`}>
                {React.createElement(wallet.icon, { className: "w-7 h-7 " })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-white">
                    {wallet.name}
                  </h3>
                  {wallet.balance >= calculateTotal() && (
                    <Badge
                      variant="secondary"
                      className="text-[11px] px-2 py-0.5 bg-white text-black border-walmart-true-blue/20 dark:bg-walmart-sky-blue/20 dark:text-walmart-sky-blue dark:border-walmart-sky-blue/30"
                    >
                      Sufficient Balance
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1">
                  Balance:{" "}
                  <span className="font-semibold flex items-center">
                    <FaIndianRupeeSign className="scale-90  text-white/80" />
                    {formatCurrency(wallet.balance)}
                  </span>
                  {wallet.balance < calculateTotal() && wallet.balance > 0 && (
                    <span className="text-red-500 ml-2">
                      (Partial payment available)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    selectedWallet === wallet.id
                      ? "border-walmart-true-blue bg-walmart-true-blue"
                      : "border-white/30 border-2"
                  }`}
                >
                  {selectedWallet === wallet.id && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
