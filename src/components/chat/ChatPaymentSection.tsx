import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatPaymentSecurityBanner } from "./ChatPaymentSecurityBanner";
import { ChatOrderSummary } from "./ChatOrderSummary";
import { ChatPaymentMethods } from "./ChatPaymentMethods";
import SlideToPay from "@/components/ui/slide-to-pay";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiPhonepe } from "react-icons/si";
import { ChevronRight } from "lucide-react";

interface ChatPaymentSectionProps {
  getTotalItems: () => number;
  getTotalPrice: () => number;
  selectedCoupons: string[];
  HARDCODED_COUPONS: any[];
  calculateTotal: () => number;
  WALLET_OPTIONS: any[];
  selectedWallet: string;
  selectWallet: (id: string) => void;
  onSlidePay: () => void;
  isSlideDisabled?: boolean;
  onClose?: () => void; // Add onClose prop
}

export const ChatPaymentSection: React.FC<ChatPaymentSectionProps> = ({
  getTotalItems,
  getTotalPrice,
  selectedCoupons,
  HARDCODED_COUPONS,
  calculateTotal,
  WALLET_OPTIONS,
  selectedWallet,
  selectWallet,
  onSlidePay,
  isSlideDisabled = false,
  onClose, // Destructure onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AnimatePresence initial={false}>
      {/* Overlay for outside click */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        style={{ pointerEvents: onClose ? "auto" : "none" }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        className=" fixed inset-x-0 bottom-0 z-50 bg-black/40 backdrop-blur-sm dark:bg-neutral-900 rounded-t-2xl shadow-2xl border-t border-muted max-h-[60vh] overflow-y-auto"
        style={{ minHeight: 120 }}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing when clicking inside
      >
        <div className="w-full max-w-md mx-auto p-4">
          {/* Drag handle */}
          <div
            className="flex justify-center mb-2 cursor-pointer"
            onClick={() => setIsExpanded((v) => !v)}
          >
            <div className="w-12 h-1.5 rounded-full bg-white" />
          </div>
          {/* Collapsed summary (always visible at bottom) */}
          <motion.div
            animate={{
              height: isExpanded ? "auto" : 120, // Increased from 200 to 260
              overflow: isExpanded ? "visible" : "hidden",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="relative"
          >
            <Card className="rounded-2xl bg-transparent flex items-center justify-between mb-2 flex-col border-none p-0 shadow-none">
              <div className="flex items-center justify-between w-full bg-transparent">
                {/* Google Pay Provider */}
                <div className="flex items-center gap-2 ">
                  <SiPhonepe className="w-10 h-10 border border-white/10 rounded-sm p-1 text-black bg-white" />
                  <div className="flex flex-col">
                    <span className="text-xs text-white/80">Pay using</span>
                    <span className="font-semibold text-sm text-white">
                      PhonePe Lite
                    </span>
                  </div>
                </div>

                {/* Provider Change Button */}
                <Button
                  size="sm"
                  className=" text-white font-semibold flex items-center gap-1 border-none p-0 m-0"
                  variant="link"
                  onClick={() => setIsExpanded(true)}
                >
                  Change
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Slide to Pay Button */}
              <div className="w-full">
                <SlideToPay
                  amount={calculateTotal()}
                  label="Slide to Pay"
                  onComplete={onSlidePay}
                  disabled={isSlideDisabled}
                />
              </div>
            </Card>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 mt-6"
                >
                  {/* <ChatPaymentSecurityBanner /> */}
                  <ChatOrderSummary
                    getTotalItems={getTotalItems}
                    getTotalPrice={getTotalPrice}
                    selectedCoupons={selectedCoupons}
                    HARDCODED_COUPONS={HARDCODED_COUPONS}
                    calculateTotal={calculateTotal}
                  />
                  <ChatPaymentMethods
                    WALLET_OPTIONS={WALLET_OPTIONS}
                    selectedWallet={selectedWallet}
                    selectWallet={selectWallet}
                    calculateTotal={calculateTotal}
                  />
                  <div className="flex justify-center bg-white hover:bg-white/90 cursor-pointer text-black rounded-lg">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsExpanded(false)}
                      className="hover:bg-transparent hover:text-black/80 border w-full p-4"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatPaymentSection;
