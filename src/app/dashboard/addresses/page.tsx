"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, MapPin, Home, Building2, Edit2, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface Address {
  id: string;
  type: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
  icon: any;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    address: "",
    city: "",
    phone: ""
  });

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      type: formData.type,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      isDefault: addresses.length === 0,
      icon: formData.type.toLowerCase() === 'work' ? Building2 : Home
    };
    
    setAddresses([...addresses, newAddress]);
    setFormData({ type: "", name: "", address: "", city: "", phone: "" });
    setIsDialogOpen(false);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      phone: address.phone
    });
    setIsDialogOpen(true);
  };

  const handleUpdateAddress = () => {
    if (!editingAddress) return;
    
    const updatedAddresses = addresses.map(addr => 
      addr.id === editingAddress.id 
        ? { ...addr, ...formData, icon: formData.type.toLowerCase() === 'work' ? Building2 : Home }
        : addr
    );
    
    setAddresses(updatedAddresses);
    setEditingAddress(null);
    setFormData({ type: "", name: "", address: "", city: "", phone: "" });
    setIsDialogOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    if (updatedAddresses.length > 0) {
      const deletedAddress = addresses.find(addr => addr.id === id);
      if (deletedAddress?.isDefault) {
        updatedAddresses[0].isDefault = true;
      }
    }
    setAddresses(updatedAddresses);
  };

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
  };

  const resetForm = () => {
    setFormData({ type: "", name: "", address: "", city: "", phone: "" });
    setEditingAddress(null);
  };

  // Prevent scroll issues when dialog is open
  useEffect(() => {
    if (isDialogOpen) {
      document.body.setAttribute('data-lenis-prevent', '');
    } else {
      document.body.removeAttribute('data-lenis-prevent');
    }
    
    return () => {
      document.body.removeAttribute('data-lenis-prevent');
    };
  }, [isDialogOpen]);

  console.log('Dialog state:', isDialogOpen); // Debug log
  
  return (
    <div className="bg-background  font-light space-y-10">
      {/* Addresses Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 mt-3 md:mt-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-walmart-true-blue/10 dark:bg-walmart-true-blue/20">
              <MapPin className="h-4 w-4 text-walmart-true-blue" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-foreground">
                Delivery Addresses
              </h3>
              <p className="text-xs text-foreground/80 mt-1">
                Manage your delivery addresses and shipping preferences
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      <div className="space-y-10">
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {addresses.map((address) => (
            <Card key={address.id}>
              <div className="space-y-3">
                {/* Address Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <address.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{address.type}</h3>
                        {address.isDefault && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5"
                          >
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-foreground/80">
                        {address.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Address Details */}
                <div className="pl-11 space-y-1">
                  <p className="text-sm">{address.address}</p>
                  <p className="text-sm text-foreground/80">{address.city}</p>
                  <p className="text-sm text-foreground/80">{address.phone}</p>
                </div>

                {/* Actions */}
                {!address.isDefault && (
                  <div className="pl-11">
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                      Set as Default
                    </Button>
                  </div>
                )}
              </div>
            </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No addresses added yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add your first delivery address to get started</p>
          </div>
        )}
        {/* Add New Address */}
        <Card 
          className="border-dashed border-2 border-muted-foreground/20 w-full bg-transparent cursor-pointer" 
          data-lenis-prevent
          onClick={() => {
            console.log('Add address clicked');
            setIsDialogOpen(true);
          }}
        >
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto p-4"
            >
              <div className="p-2 rounded-lg bg-muted/50">
                <Plus className="h-4 w-4 text-foreground/80" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Add New Address</p>
                <p className="text-xs text-foreground/80 font-light">
                  Home, work, or other locations
                </p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
                  <p className="text-sm text-muted-foreground">
                    {editingAddress ? 'Update your address information below.' : 'Add a new delivery address to your account.'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Address Type</Label>
                    <Input
                      id="type"
                      placeholder="e.g., Home, Work, Other"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter street address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City, State, ZIP</Label>
                    <Input
                      id="city"
                      placeholder="Enter city, state, and ZIP code"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                      disabled={!formData.type || !formData.name || !formData.address || !formData.city || !formData.phone}
                    >
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
