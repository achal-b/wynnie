/**
 * Flow 3: Product Selection → Warehouse Selection → Delivery → Last-Mile Coordination
 * Handles the logistics and delivery optimization after product selection
 */

import { Product, SearchResult } from './flow2-product-search';

// Types for Flow 3
export interface WarehouseInfo {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  distance: number; // in miles
  capacity: number;
  currentStock: number;
  deliveryRadius: number; // in miles
  operationalHours: {
    open: string;
    close: string;
    isOpen24Hours: boolean;
  };
  deliveryMethods: DeliveryMethod[];
  lastMilePartners: string[];
}

export interface DeliveryMethod {
  id: string;
  name: string;
  type: 'same_day' | 'next_day' | 'two_day' | 'standard' | 'express';
  estimatedTime: string;
  cost: number;
  available: boolean;
  cutoffTime?: string; // for same day delivery
}

export interface DeliveryRoute {
  id: string;
  warehouseId: string;
  deliveryAddress: DeliveryAddress;
  estimatedDistance: number;
  estimatedTime: string;
  route: RouteStep[];
  lastMilePartner: string;
  deliverySlots: DeliverySlot[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DeliverySlot {
  id: string;
  date: string;
  timeSlot: string;
  available: boolean;
  premium: boolean;
  cost: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  deliveryInstructions?: string;
}

export interface Flow3Result {
  selectedProducts: Product[];
  optimalWarehouse: WarehouseInfo;
  deliveryRoute: DeliveryRoute;
  deliveryOptions: DeliveryMethod[];
  recommendedDelivery: DeliveryMethod;
  lastMileCoordination: {
    partner: string;
    trackingId: string;
    estimatedDelivery: string;
    realTimeUpdates: boolean;
  };
  totalDeliveryCost: number;
  totalEstimatedTime: string;
  sustainabilityScore: number;
}

export class Flow3DeliveryOptimization {
  /**
   * Main Flow 3 Entry Point - Optimizes delivery after product selection
   */
  static async processDeliveryFlow(
    selectedProducts: Product[], 
    deliveryAddress: DeliveryAddress,
    userPreferences?: {
      prioritySpeed?: boolean;
      priorityCost?: boolean;
      environmentallyFriendly?: boolean;
    }
  ): Promise<Flow3Result> {
    console.log('🚛 Flow 3 Started: Delivery Optimization', { 
      productCount: selectedProducts.length, 
      deliveryAddress: deliveryAddress.city 
    });

    try {
      // Step 1: Find optimal Walmart warehouse
      const optimalWarehouse = await this.selectOptimalWarehouse(selectedProducts, deliveryAddress);
      
      // Step 2: Calculate delivery routes and options
      const deliveryRoute = await this.calculateDeliveryRoute(optimalWarehouse, deliveryAddress);
      
      // Step 3: Get available delivery methods
      const deliveryOptions = await this.getDeliveryOptions(optimalWarehouse, deliveryAddress);
      
      // Step 4: Select recommended delivery method based on preferences
      const recommendedDelivery = this.selectRecommendedDelivery(deliveryOptions, userPreferences);
      
      // Step 5: Coordinate last-mile delivery
      const lastMileCoordination = await this.coordinateLastMileDelivery(
        optimalWarehouse, 
        deliveryRoute, 
        recommendedDelivery
      );
      
      // Step 6: Calculate total costs and sustainability
      const totalDeliveryCost = this.calculateTotalDeliveryCost(selectedProducts, recommendedDelivery);
      const sustainabilityScore = this.calculateSustainabilityScore(deliveryRoute, recommendedDelivery);

      return {
        selectedProducts,
        optimalWarehouse,
        deliveryRoute,
        deliveryOptions,
        recommendedDelivery,
        lastMileCoordination,
        totalDeliveryCost,
        totalEstimatedTime: recommendedDelivery.estimatedTime,
        sustainabilityScore
      };

    } catch (error) {
      console.error('Flow 3 Error:', error);
      return this.getFallbackDeliveryResult(selectedProducts, deliveryAddress);
    }
  }

  /**
   * Step 1: Select optimal Walmart warehouse based on products and location
   */
  private static async selectOptimalWarehouse(
    products: Product[], 
    deliveryAddress: DeliveryAddress
  ): Promise<WarehouseInfo> {
    // Get available warehouses near delivery address
    const nearbyWarehouses = await this.getNearbyWarehouses(deliveryAddress);
    
    // Score warehouses based on multiple factors
    const scoredWarehouses = nearbyWarehouses.map(warehouse => ({
      warehouse,
      score: this.calculateWarehouseScore(warehouse, products, deliveryAddress)
    }));

    // Sort by score and return the best warehouse
    scoredWarehouses.sort((a, b) => b.score - a.score);
    
    console.log('🏢 Selected optimal warehouse:', scoredWarehouses[0].warehouse.name);
    return scoredWarehouses[0].warehouse;
  }

  /**
   * Calculate warehouse score based on distance, stock, capacity, etc.
   */
  private static calculateWarehouseScore(
    warehouse: WarehouseInfo, 
    products: Product[], 
    deliveryAddress: DeliveryAddress
  ): number {
    let score = 100;
    
    // Distance factor (closer is better)
    score -= warehouse.distance * 2;
    
    // Stock availability factor
    const stockAvailability = products.every(product => 
      warehouse.currentStock > 0 // Simplified check
    );
    if (!stockAvailability) score -= 30;
    
    // Delivery methods factor
    score += warehouse.deliveryMethods.length * 5;
    
    // Capacity factor
    score += (warehouse.capacity / 1000) * 2;
    
    return Math.max(0, score);
  }

  /**
   * Step 2: Calculate optimal delivery route
   */
  private static async calculateDeliveryRoute(
    warehouse: WarehouseInfo, 
    deliveryAddress: DeliveryAddress
  ): Promise<DeliveryRoute> {
    // In a real implementation, this would use Google Maps API or similar
    const estimatedDistance = warehouse.distance;
    const estimatedTime = this.calculateEstimatedTime(estimatedDistance);
    
    // Generate mock route steps
    const route: RouteStep[] = [
      {
        instruction: `Start from ${warehouse.name}`,
        distance: 0,
        duration: '0 min',
        coordinates: warehouse.location.coordinates
      },
      {
        instruction: `Head ${this.getDirection(warehouse.location, deliveryAddress)}`,
        distance: estimatedDistance * 0.7,
        duration: this.calculateEstimatedTime(estimatedDistance * 0.7),
        coordinates: {
          lat: warehouse.location.coordinates.lat + 0.01,
          lng: warehouse.location.coordinates.lng + 0.01
        }
      },
      {
        instruction: `Arrive at ${deliveryAddress.street}`,
        distance: estimatedDistance,
        duration: estimatedTime,
        coordinates: deliveryAddress.coordinates || {
          lat: warehouse.location.coordinates.lat + 0.02,
          lng: warehouse.location.coordinates.lng + 0.02
        }
      }
    ];

    // Get available delivery slots
    const deliverySlots = this.generateDeliverySlots();

    return {
      id: `ROUTE_${Date.now()}`,
      warehouseId: warehouse.id,
      deliveryAddress,
      estimatedDistance,
      estimatedTime,
      route,
      lastMilePartner: this.selectLastMilePartner(warehouse),
      deliverySlots
    };
  }

  /**
   * Step 3: Get available delivery options
   */
  private static async getDeliveryOptions(
    warehouse: WarehouseInfo, 
    deliveryAddress: DeliveryAddress
  ): Promise<DeliveryMethod[]> {
    const baseOptions: DeliveryMethod[] = [
      {
        id: 'same_day',
        name: 'Same Day Delivery',
        type: 'same_day',
        estimatedTime: '2-4 hours',
        cost: 9.99,
        available: warehouse.distance <= 15 && this.isBeforeCutoff('16:00'),
        cutoffTime: '16:00'
      },
      {
        id: 'next_day',
        name: 'Next Day Delivery',
        type: 'next_day',
        estimatedTime: 'By tomorrow 8 PM',
        cost: 7.99,
        available: true
      },
      {
        id: 'two_day',
        name: 'Two Day Delivery',
        type: 'two_day',
        estimatedTime: '2 business days',
        cost: 4.99,
        available: true
      },
      {
        id: 'standard',
        name: 'Standard Delivery',
        type: 'standard',
        estimatedTime: '3-5 business days',
        cost: 0,
        available: true
      },
      {
        id: 'express',
        name: 'Express Delivery',
        type: 'express',
        estimatedTime: '1-2 hours',
        cost: 19.99,
        available: warehouse.distance <= 10 && warehouse.deliveryMethods.some(dm => dm.type === 'express')
      }
    ];

    return baseOptions.filter(option => option.available);
  }

  /**
   * Step 4: Select recommended delivery method
   */
  private static selectRecommendedDelivery(
    options: DeliveryMethod[], 
    preferences?: {
      prioritySpeed?: boolean;
      priorityCost?: boolean;
      environmentallyFriendly?: boolean;
    }
  ): DeliveryMethod {
    if (!preferences) {
      // Default to next day delivery
      return options.find(opt => opt.type === 'next_day') || options[0];
    }

    if (preferences.prioritySpeed) {
      return options.reduce((fastest, current) => 
        this.compareDeliverySpeed(current, fastest) < 0 ? current : fastest
      );
    }

    if (preferences.priorityCost) {
      return options.reduce((cheapest, current) => 
        current.cost < cheapest.cost ? current : cheapest
      );
    }

    if (preferences.environmentallyFriendly) {
      // Prefer standard delivery (consolidated shipping)
      return options.find(opt => opt.type === 'standard') || options[0];
    }

    return options.find(opt => opt.type === 'next_day') || options[0];
  }

  /**
   * Step 5: Coordinate last-mile delivery
   */
  private static async coordinateLastMileDelivery(
    warehouse: WarehouseInfo,
    route: DeliveryRoute,
    deliveryMethod: DeliveryMethod
  ): Promise<Flow3Result['lastMileCoordination']> {
    const partner = route.lastMilePartner;
    const trackingId = `WM${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate estimated delivery time
    const estimatedDelivery = this.calculateEstimatedDeliveryTime(deliveryMethod);

    return {
      partner,
      trackingId,
      estimatedDelivery,
      realTimeUpdates: true
    };
  }

  /**
   * Helper methods
   */
  private static async getNearbyWarehouses(deliveryAddress: DeliveryAddress): Promise<WarehouseInfo[]> {
    // Mock warehouses based on location
    const mockWarehouses: WarehouseInfo[] = [
      {
        id: 'WH_DFW_001',
        name: 'Walmart Fulfillment Center - Dallas',
        location: {
          address: '2150 Logistics Dr',
          city: 'Dallas',
          state: 'TX',
          zipCode: '75236',
          coordinates: { lat: 32.7767, lng: -96.7970 }
        },
        distance: Math.random() * 20 + 5,
        capacity: 50000,
        currentStock: 45000,
        deliveryRadius: 50,
        operationalHours: {
          open: '06:00',
          close: '22:00',
          isOpen24Hours: false
        },
        deliveryMethods: [
          { id: 'same_day', name: 'Same Day', type: 'same_day', estimatedTime: '2-4 hours', cost: 9.99, available: true },
          { id: 'next_day', name: 'Next Day', type: 'next_day', estimatedTime: 'By tomorrow', cost: 7.99, available: true }
        ],
        lastMilePartners: ['UPS', 'FedEx', 'Walmart Delivery']
      },
      {
        id: 'WH_HOU_001',
        name: 'Walmart Fulfillment Center - Houston',
        location: {
          address: '5555 Northwest Fwy',
          city: 'Houston',
          state: 'TX',
          zipCode: '77092',
          coordinates: { lat: 29.7604, lng: -95.3698 }
        },
        distance: Math.random() * 30 + 10,
        capacity: 60000,
        currentStock: 55000,
        deliveryRadius: 60,
        operationalHours: {
          open: '05:00',
          close: '23:00',
          isOpen24Hours: false
        },
        deliveryMethods: [
          { id: 'next_day', name: 'Next Day', type: 'next_day', estimatedTime: 'By tomorrow', cost: 7.99, available: true },
          { id: 'standard', name: 'Standard', type: 'standard', estimatedTime: '3-5 days', cost: 0, available: true }
        ],
        lastMilePartners: ['UPS', 'Walmart Delivery']
      }
    ];

    return mockWarehouses;
  }

  private static calculateEstimatedTime(distance: number): string {
    const timeInMinutes = Math.round(distance * 2.5); // ~2.5 minutes per mile
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    }
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  private static getDirection(from: WarehouseInfo['location'], to: DeliveryAddress): string {
    // Simplified direction calculation
    const directions = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private static selectLastMilePartner(warehouse: WarehouseInfo): string {
    return warehouse.lastMilePartners[0] || 'Walmart Delivery';
  }

  private static generateDeliverySlots(): DeliverySlot[] {
    const slots: DeliverySlot[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Morning slot
      slots.push({
        id: `SLOT_${i}_AM`,
        date: date.toISOString().split('T')[0],
        timeSlot: '8:00 AM - 12:00 PM',
        available: Math.random() > 0.3,
        premium: false,
        cost: 0
      });
      
      // Afternoon slot
      slots.push({
        id: `SLOT_${i}_PM`,
        date: date.toISOString().split('T')[0],
        timeSlot: '1:00 PM - 5:00 PM',
        available: Math.random() > 0.2,
        premium: false,
        cost: 0
      });
      
      // Evening slot (premium)
      slots.push({
        id: `SLOT_${i}_EVE`,
        date: date.toISOString().split('T')[0],
        timeSlot: '6:00 PM - 9:00 PM',
        available: Math.random() > 0.4,
        premium: true,
        cost: 4.99
      });
    }
    
    return slots;
  }

  private static isBeforeCutoff(cutoffTime: string): boolean {
    const now = new Date();
    const [hours, minutes] = cutoffTime.split(':');
    const cutoff = new Date();
    cutoff.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return now < cutoff;
  }

  private static compareDeliverySpeed(a: DeliveryMethod, b: DeliveryMethod): number {
    const speedOrder = ['express', 'same_day', 'next_day', 'two_day', 'standard'];
    return speedOrder.indexOf(a.type) - speedOrder.indexOf(b.type);
  }

  private static calculateTotalDeliveryCost(products: Product[], delivery: DeliveryMethod): number {
    const productTotal = products.reduce((sum, product) => sum + product.price, 0);
    return productTotal + delivery.cost;
  }

  private static calculateSustainabilityScore(route: DeliveryRoute, delivery: DeliveryMethod): number {
    let score = 100;
    
    // Distance factor (shorter is better)
    score -= route.estimatedDistance * 2;
    
    // Delivery speed factor (slower is more sustainable)
    const speedPenalty = { express: -20, same_day: -15, next_day: -5, two_day: 0, standard: 5 };
    score += speedPenalty[delivery.type] || 0;
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateEstimatedDeliveryTime(delivery: DeliveryMethod): string {
    const now = new Date();
    
    switch (delivery.type) {
      case 'express':
        now.setHours(now.getHours() + 2);
        break;
      case 'same_day':
        now.setHours(now.getHours() + 4);
        break;
      case 'next_day':
        now.setDate(now.getDate() + 1);
        now.setHours(20, 0, 0, 0);
        break;
      case 'two_day':
        now.setDate(now.getDate() + 2);
        now.setHours(20, 0, 0, 0);
        break;
      case 'standard':
        now.setDate(now.getDate() + 4);
        now.setHours(20, 0, 0, 0);
        break;
    }
    
    return now.toLocaleString();
  }

  private static getFallbackDeliveryResult(
    products: Product[], 
    deliveryAddress: DeliveryAddress
  ): Flow3Result {
    return {
      selectedProducts: products,
      optimalWarehouse: {
        id: 'WH_FALLBACK',
        name: 'Nearest Walmart Store',
        location: {
          address: '123 Main St',
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zipCode: deliveryAddress.zipCode,
          coordinates: { lat: 0, lng: 0 }
        },
        distance: 10,
        capacity: 1000,
        currentStock: 800,
        deliveryRadius: 25,
        operationalHours: {
          open: '08:00',
          close: '20:00',
          isOpen24Hours: false
        },
        deliveryMethods: [],
        lastMilePartners: ['Walmart Delivery']
      },
      deliveryRoute: {
        id: 'ROUTE_FALLBACK',
        warehouseId: 'WH_FALLBACK',
        deliveryAddress,
        estimatedDistance: 10,
        estimatedTime: '25 min',
        route: [],
        lastMilePartner: 'Walmart Delivery',
        deliverySlots: []
      },
      deliveryOptions: [{
        id: 'standard_fallback',
        name: 'Standard Delivery',
        type: 'standard',
        estimatedTime: '3-5 business days',
        cost: 0,
        available: true
      }],
      recommendedDelivery: {
        id: 'standard_fallback',
        name: 'Standard Delivery',
        type: 'standard',
        estimatedTime: '3-5 business days',
        cost: 0,
        available: true
      },
      lastMileCoordination: {
        partner: 'Walmart Delivery',
        trackingId: 'WM_FALLBACK_001',
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleString(),
        realTimeUpdates: false
      },
      totalDeliveryCost: products.reduce((sum, p) => sum + p.price, 0),
      totalEstimatedTime: '3-5 business days',
      sustainabilityScore: 75
    };
  }
}

export default Flow3DeliveryOptimization;
