"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Edit } from "lucide-react";
import Image from "next/image";

const userDetails = {
  imageURL: "https://github.com/shadcn.png",
  firstName: "praveen",
  lastName: "Lodhi",
  email: "praveenlodhi.official@gmail.com",
  phone: "+91 987654XXXX",
  gender: "male",
  shippingAddress: "123, Main Street, Mumbai, India",
  billingAddress: "123, Main Street, Mumbai, India",
};

export default function ProfileSettingsPage() {
  return (
    <div className="p-2 font-light capitalize">
      <div className="flex flex-col gap-8">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-walmart-sky-blue/20 dark:bg-walmart-true-blue/10 flex items-center justify-center border border-border">
              <Image
                src={userDetails.imageURL}
                alt="Profile Picture"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border border-border hover:bg-walmart-sky-blue/20 dark:hover:bg-walmart-true-blue/10"
            >
              <Edit className="h-3 w-3 text-walmart-true-blue" />
            </Button>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">
              Change Profile Picture
            </h3>
            <p className="text-sm text-foreground/80">Upload a new photo</p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              defaultValue={userDetails.firstName}
              className="capitalize bg-background border-border text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              defaultValue={userDetails.lastName}
              className="capitalize bg-background border-border text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-foreground font-medium">
            Gender
          </Label>
          <select
            id="gender"
            name="gender"
            defaultValue={userDetails.gender || "Prefer not to say"}
            className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-walmart-true-blue/20 focus:border-walmart-true-blue/50"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
              <Input
                id="email"
                type="email"
                defaultValue={userDetails.email}
                className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
              <Input
                id="phone"
                type="tel"
                defaultValue={userDetails.phone}
                className="pl-10 bg-background border-border text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-2">
          <Label
            htmlFor="shippingAddress"
            className="text-foreground font-medium"
          >
            Shipping Address
          </Label>
          <Textarea
            id="shippingAddress"
            placeholder="Enter your shipping address"
            defaultValue={userDetails.shippingAddress}
            className="bg-background border-border text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
          />
        </div>

        {/* Billing Address with Same as Shipping Option */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="billingAddress"
              className="text-foreground font-medium"
            >
              Billing Address
            </Label>
            <input
              type="checkbox"
              id="sameAsShipping"
              className="ml-2 rounded border-border text-walmart-true-blue focus:ring-walmart-true-blue focus:ring-2 focus:ring-offset-2 focus:ring-offset-background"
            />
            <Label
              htmlFor="sameAsShipping"
              className="text-sm font-normal cursor-pointer text-foreground/80 hover:text-foreground"
            >
              Same as shipping
            </Label>
          </div>
          <Textarea
            id="billingAddress"
            placeholder="Enter your billing address"
            defaultValue={userDetails.billingAddress}
            className="bg-background border-border text-foreground placeholder:text-foreground/60 focus:border-walmart-true-blue/50 focus:ring-walmart-true-blue/20"
          />
        </div>

        <Button className="w-full bg-walmart-true-blue hover:bg-walmart-bentonville-blue text-white">
          Save Profile Changes
        </Button>
      </div>
    </div>
  );
}
