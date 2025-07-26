import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import {
  FaMapMarkerAlt,
  FaUserTie,
  FaPhoneAlt,
  FaClock,
  FaHashtag,
  FaMapPin,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MapboxRouteMap } from "./MapboxRouteMap";
import Image from "next/image";

interface WalletOption {
  id: string;
  name: string;
}

interface OrderConfirmationProps {
  isVisible: boolean;
  selectedWallet: string;
  walletOptions: WalletOption[];
  calculateTotal: () => number;
  onStartNewOrder: () => void;
}

const DELIVERY_ADDRESS = {
  address: "Flat 302, Tower B, Prestige Lakeside Habitat, Varthur",
  city: "Bengaluru, Karnataka",
  pin: "560087",
};
const DELIVERY_GUY = {
  name: "Ravi Kumar",
  phone: "+91 98765 43210",
};
const DELIVERY_TIME = "Today, 2:30 - 3:30 PM";

function getCoordsFromEnv(envVar: string | undefined): [number, number] {
  if (!envVar) return [0, 0];
  const [lng, lat] = envVar.split(",").map(Number);
  return [lng, lat];
}

const WAREHOUSE_COORDS = getCoordsFromEnv(
  process.env.NEXT_PUBLIC_WAREHOUSE_COORDS
);
const DELIVERY_COORDS = getCoordsFromEnv(
  process.env.NEXT_PUBLIC_DELIVERY_COORDS
);
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const OrderConfirmation = ({
  isVisible,
  selectedWallet,
  walletOptions,
  calculateTotal,
  onStartNewOrder,
}: OrderConfirmationProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const selectedWalletData = walletOptions.find((w) => w.id === selectedWallet);
  const orderId = Math.random().toString(36).substring(2, 11).toUpperCase();

  useEffect(() => {
    if (isVisible) {
      setShowDetails(false);
      const timer = setTimeout(() => setShowDetails(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black z-[1000]"
        style={{ pointerEvents: "auto" }}
        onClick={onStartNewOrder}
      />
      {/* Centered Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        className="fixed z-[1010] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[90vw] md:w-fit h-fit"
        // style={{ width: "min(90vw, 480px)", height: "min(90vh, 750px)" }}
      >
        <Card className="w-full h-full flex flex-col bg-white/95 dark:bg-neutral-900 border-2 shadow-white contrast-110 brightness-105 shadow-2xl rounded-2xl relative">
          {/* Close Icon */}
          <button
            className="absolute top-4 right-4 z-10 text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white"
            onClick={onStartNewOrder}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <CardContent className="p-0 text-center flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!showDetails && (
                <motion.div
                  key="confirming"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center space-y-4 h-full"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-spin-slow shadow-lg mt-8">
                    <IoCheckmarkDoneSharp className="text-white text-4xl animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mt-2">
                    Confirming your order...
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Please wait while we confirm your order and3ass3gn a
                    delivery partner.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showDetails && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-full w-full px-2"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg mt-6 mb-2">
                    <IoCheckmarkDoneSharp className="text-white text-4xl" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-200 mb-1 flex items-center gap-2">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mb-4 text-sm">
                    Your order has been confirmed and is being processed
                  </p>
                  <div className="w-full max-w-xs mx-auto flex flex-col gap-3 text-left">
                    {/* Address */}
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-300 text-sm">
                        <FaMapMarkerAlt className="text-sm h-3 w-3" />
                        Delivery Address
                      </div>
                      <div className="ml-6 text-xs text-gray-700 dark:text-gray-200 mt-1  items-start gap-2 flex flex-col">
                        {DELIVERY_ADDRESS.address}, {DELIVERY_ADDRESS.city} -{" "}
                        {DELIVERY_ADDRESS.pin}
                        <div className="relative w-full h-40">
                          <Image
                            src="/icons/map.jpg"
                            alt="Map"
                            fill
                            className="rounded-lg object-top"
                            style={{ objectFit: "cover" }}
                          />
                          {/* Blinking destination marker */}
                          <div
                            className="absolute"
                            style={{
                              top: "27.5%", // Approximate destination point
                              left: "50%", // Approximate destination point
                              transform: "translate(-50%, -50%)",
                              zIndex: 2,
                            }}
                          >
                            <span className="block w-5 h-5 rounded-full bg-transparent animate-blink border-4 border-white shadow-lg" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="my-1 border-green-100 dark:border-green-900" />
                    {/* Delivery Partner */}
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-300 text-sm">
                        <FaUserTie className="text-sm h-3 w-3" />
                        Delivery Partner
                      </div>
                      <div className="ml-6 text-xs text-gray-700 dark:text-gray-200 mt-1">
                        {`${DELIVERY_GUY.name} (${DELIVERY_GUY.phone})`}
                      </div>
                    </div>
                    <hr className="my-1 border-green-100 dark:border-green-900" />
                    {/* Order Number */}
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-300 text-sm">
                        <FaHashtag className="text-sm h-3 w-3" />
                        Order Number
                      </div>
                      <div className="ml-6 text-xs font-mono mt-1">
                        #{orderId}
                      </div>
                    </div>
                    <hr className="my-1 border-green-100 dark:border-green-900" />
                    {/* Delivery Time */}
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-300 text-sm">
                        <FaClock className="text-sm h-3 w-3" />
                        Delivery Time
                      </div>
                      <div className="ml-6 text-xs text-gray-700 dark:text-gray-200 mt-1">
                        {DELIVERY_TIME}
                      </div>
                    </div>
                  </div>
                  {/* Mapbox Map */}
                  {/* <div className="w-full flex justify-center mt-4">
                    <MapboxRouteMap
                      warehouseCoords={WAREHOUSE_COORDS as [number, number]}
                      deliveryCoords={DELIVERY_COORDS as [number, number]}
                      mapboxToken={MAPBOX_TOKEN}
                      width={320}
                      height={200}
                    />
                  </div> */}

                  {/* <div className="mt-6">
                    <Button
                      size="lg"
                      onClick={onStartNewOrder}
                      className="bg-green-600 hover:bg-green-700 text-lg px-8 py-2 rounded-full shadow-md"
                    >
                      Start New Order
                    </Button>
                  </div> */}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
