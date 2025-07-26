"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { CartModal } from "@/components/CartModal";
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  Search,
  Loader2,
  User,
} from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

const trackingSteps = [
  {
    id: 1,
    title: "Order Placed",
    description: "Your order has been confirmed",
    time: "Jan 16, 2:30 PM",
    status: "completed",
    icon: CheckCircle,
    location: "Online",
  },
  {
    id: 2,
    title: "Order Confirmed",
    description: "Seller has confirmed your order",
    time: "Jan 16, 3:00 PM",
    status: "completed",
    icon: CheckCircle,
    location: "Seller Warehouse",
  },
  {
    id: 3,
    title: "Product Picked Up",
    description: "Product picked up from seller",
    time: "Jan 16, 4:15 PM",
    status: "completed",
    icon: Package,
    location: "Mumbai Warehouse",
  },
  {
    id: 4,
    title: "In Transit",
    description: "Package is on the way to delivery hub",
    time: "Jan 17, 8:00 AM",
    status: "completed",
    icon: Truck,
    location: "Delhi Hub",
  },
  {
    id: 5,
    title: "Out for Delivery",
    description: "Your order is out for delivery",
    time: "Jan 17, 10:00 AM",
    status: "current",
    icon: Truck,
    location: "Local Delivery Center",
  },
  {
    id: 6,
    title: "Delivered",
    description: "Order delivered successfully",
    time: "Expected by 2:00 PM",
    status: "pending",
    icon: CheckCircle,
    location: "Your Address",
  },
];

const orderDetails = {
  id: "ORD-002",
  items: [
    {
      name: "Organic Bananas",
      quantity: 2,
      price: 45,
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      name: "Whole Wheat Bread",
      quantity: 1,
      price: 35,
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      name: "Fresh Milk",
      quantity: 1,
      price: 28,
      image: "/placeholder.svg?height=50&width=50",
    },
  ],
  total: 108,
  deliveryAddress: "123 Main Street, Apt 4B, New York, NY 10001",
  estimatedDelivery: "Today, 2:00 PM",
  deliveryPartner: "Express Delivery",
  deliveryPersonName: "Raj Kumar",
  deliveryPersonPhone: "+91 98765 43210",
  trackingNumber: "ED123456789",
  currentLocation: "5 km away from your location",
};

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("ORD-002");
  const [isSearching, setIsSearching] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(orderDetails);

  const handleTrackOrder = async () => {
    setIsSearching(true);
    setTimeout(() => {
      setCurrentOrder(orderDetails);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="w-full bg-background py-5">
      <div className="space-y-6">
        {/* Search Order */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/80" />
              <Input
                placeholder="Enter order ID"
                className="pl-10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTrackOrder}
              disabled={isSearching}
              className="w-full sm:w-auto bg-primary text-primary-foreground"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Track"
              )}
            </Button>
          </div>
        </motion.div>

        {/* Live Tracking Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Live Tracking
              </CardTitle>
            </CardHeader>
            <div className="relative h-32 sm:h-48 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-1 sm:space-y-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-500 rounded-full mx-auto flex items-center justify-center"
                  >
                    <Truck className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </motion.div>
                  <p className="text-xs sm:text-sm font-medium">
                    Delivery Partner
                  </p>
                  <p className="text-xs text-foreground/80">
                    {currentOrder.currentLocation}
                  </p>
                </div>
              </div>
              <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-blue-500 opacity-50"></div>
              <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>

            {/* Delivery Partner Info */}
            <div className="mt-3 sm:mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-xs sm:text-sm">
                      {currentOrder.deliveryPersonName}
                    </p>
                    <p className="text-xs text-foreground/80">
                      Delivery Partner
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-4">{currentOrder.deliveryAddress}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call Delivery Partner
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Share Live Location
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tracking Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-4">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";

                  return (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 sm:gap-4"
                    >
                      {/* Step Icon */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500"
                            : isCurrent
                            ? "bg-blue-500"
                            : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${
                            isCompleted || isCurrent
                              ? "text-white"
                              : "text-foreground/80"
                          }`}
                        />
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`font-medium text-sm sm:text-base ${
                              isCurrent
                                ? "text-blue-600 dark:text-blue-400"
                                : isCompleted
                                ? "text-green-600 dark:text-green-400"
                                : "text-foreground/80"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span className="text-xs text-foreground/80">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground/80 mb-1">
                          {step.description}
                        </p>
                        <p className="text-xs text-foreground/80">
                          {step.location}
                        </p>
                      </div>

                      {/* Connection Line */}
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`absolute left-4 sm:left-5 w-0.5 h-8 sm:h-10 ${
                            isCompleted ? "bg-green-500" : "bg-muted"
                          }`}
                          style={{ top: "2rem", transform: "translateX(50%)" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
