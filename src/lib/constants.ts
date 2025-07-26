import {
  Package,
  ChefHat,
  Shirt,
  Search,
  CheckCircle,
  Loader2,
  Home,
  Building2,
  Brain,
  Globe,
  FileText,
  Database,
} from "lucide-react";
import { SiPaytm, SiPhonepe, SiGooglepay, SiPaypal } from "react-icons/si";
import { RecommendationPrompt } from "./types";
import { ReactNode } from "react";

export const RECOMMENDATION_PROMPTS: RecommendationPrompt[] = [
  {
    icon: Package,
    title: "Order groceries with Wynnie",
    description: "Tell Wynnie what groceries you need",
    prompt: "I need to order groceries",
  },
  {
    icon: ChefHat,
    title: "Cook with Wynnie's help",
    description: "Get ingredients for white sauce pasta or any dish",
    prompt: "Order me ingredients for white sauce pasta",
  },
  {
    icon: Shirt,
    title: "Style with Wynnie",
    description: "Find clothes that match your style",
    prompt: "Buy me jeans that match this shirt",
  },
  {
    icon: Package,
    title: "Need a Coffee Machine?",
    description: "Get me a coffee machine asap",
    prompt: "I need a coffee machine asap",
  },
];

export const LOADING_STEPS = [
  {
    icon: Search,
    texts: [
      {
        text: "Searching query...",
        description:
          "Analyzing your search request and understanding your needs",
      },
      {
        text: "Analyzing your request...",
        description: "Processing the intent and context of your query",
      },
      {
        text: "Processing search terms...",
        description: "Breaking down your request into searchable components",
      },
      {
        text: "Understanding your needs...",
        description: "Identifying the best approach to fulfill your request",
      },
      {
        text: "Initializing search engine...",
        description: "Setting up the search infrastructure and algorithms",
      },
      {
        text: "Preparing search parameters...",
        description: "Configuring search filters and optimization settings",
      },
      {
        text: "Loading search algorithms...",
        description: "Initializing advanced search and recommendation systems",
      },
      {
        text: "Starting query analysis...",
        description: "Beginning comprehensive analysis of your request",
      },
    ],
  },
  {
    icon: Globe,
    texts: [
      {
        text: "Fetching best products...",
        description: "Searching through our extensive product catalog",
      },
      {
        text: "Finding top recommendations...",
        description: "Identifying the most relevant products for you",
      },
      {
        text: "Searching product database...",
        description: "Querying our comprehensive product information system",
      },
      {
        text: "Gathering product options...",
        description: "Collecting available alternatives and variations",
      },
      {
        text: "Discovering relevant items...",
        description: "Exploring products that match your requirements",
      },
      {
        text: "Compiling product list...",
        description: "Organizing and ranking the best product matches",
      },
      {
        text: "Exploring available options...",
        description: "Checking inventory and availability across stores",
      },
      {
        text: "Curating best matches...",
        description: "Selecting the most suitable products for your needs",
      },
    ],
  },
  {
    icon: Brain,
    texts: [
      {
        text: "Getting product details...",
        description: "Retrieving comprehensive product specifications",
      },
      {
        text: "Retrieving specifications...",
        description: "Gathering technical details and product features",
      },
      {
        text: "Loading product information...",
        description: "Fetching complete product data and descriptions",
      },
      {
        text: "Fetching item details...",
        description: "Collecting detailed information about selected items",
      },
      {
        text: "Gathering product specs...",
        description: "Compiling technical specifications and requirements",
      },
      {
        text: "Collecting item data...",
        description: "Assembling comprehensive product information",
      },
      {
        text: "Analyzing product features...",
        description: "Evaluating product capabilities and benefits",
      },
      {
        text: "Extracting product info...",
        description: "Processing and organizing product details",
      },
    ],
  },
  {
    icon: FileText,
    texts: [
      {
        text: "Analyzing recommendations...",
        description: "Evaluating product suggestions and alternatives",
      },
      {
        text: "Evaluating best options...",
        description: "Comparing products based on your preferences",
      },
      {
        text: "Comparing products...",
        description: "Side-by-side analysis of product features and prices",
      },
      {
        text: "Reviewing suggestions...",
        description: "Assessing the quality and relevance of recommendations",
      },
      {
        text: "Assessing quality...",
        description: "Evaluating product quality and customer satisfaction",
      },
      {
        text: "Validating choices...",
        description: "Confirming the suitability of selected products",
      },
      {
        text: "Cross-referencing data...",
        description: "Verifying information across multiple sources",
      },
      {
        text: "Quality checking results...",
        description: "Ensuring accuracy and reliability of recommendations",
      },
    ],
  },
  {
    icon: Database,
    texts: [
      {
        text: "Preparing response...",
        description: "Organizing and formatting the final results",
      },
      {
        text: "Finalizing results...",
        description:
          "Completing the analysis and preparing your recommendations",
      },
      {
        text: "Organizing information...",
        description: "Structuring the data in a clear and useful format",
      },
      {
        text: "Structuring response...",
        description: "Arranging results in the most helpful presentation",
      },
      {
        text: "Formatting output...",
        description: "Preparing the final display of your recommendations",
      },
      {
        text: "Compiling final answer...",
        description: "Assembling all findings into a comprehensive response",
      },
      {
        text: "Putting it all together...",
        description: "Combining analysis and recommendations into one result",
      },
      {
        text: "Almost ready...",
        description: "Finalizing the last details of your personalized results",
      },
    ],
  },
];

export const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Organic Bananas",
    description: "Fresh organic bananas, perfect for smoothies and snacks",
    price: 45,
    originalPrice: 60,
    rating: 4.5,
    reviewCount: 128,
    image: "/Home.png",
    category: "Fruits",
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    description: "Freshly baked whole wheat bread, rich in fiber",
    price: 35,
    rating: 4.2,
    reviewCount: 89,
    image: "/Home.png",
    category: "Bakery",
  },
  {
    id: "3",
    name: "Fresh Milk",
    description: "Pure cow milk, rich in calcium and protein",
    price: 28,
    rating: 4.7,
    reviewCount: 256,
    image: "/Home.png",
    category: "Dairy",
  },
];

export const ORDERS = [
  {
    id: "ORD-PD5D5N75FX",
    status: "delivered",
    items: ["Organic Bananas", "Whole Milk", "Sourdough Bread"],
    total: "₹1,899",
    date: "Jan 15",
    estimatedDelivery: "Delivered",
    itemCount: 3,
  },
  {
    id: "ORD-7X2K4LQ9VJ",
    status: "in-transit",
    items: ["White Sauce Pasta Ingredients", "Parmesan Cheese"],
    total: "₹1,410",
    date: "Jan 16",
    estimatedDelivery: "Today, 3-5 PM",
    itemCount: 5,
  },
  {
    id: "ORD-3M8Z1T6WQY",
    status: "processing",
    items: ["Blue Jeans", "White T-Shirt"],
    total: "₹6,849",
    date: "Jan 16",
    estimatedDelivery: "Tomorrow, 2-4 PM",
    itemCount: 2,
  },
  {
    id: "ORD-9B7F2C5HJL",
    status: "delivered",
    items: ["Notebook Set", "Ballpoint Pens", "Sticky Notes"],
    total: "₹499",
    date: "Jan 17",
    estimatedDelivery: "Delivered",
    itemCount: 3,
  },
  {
    id: "ORD-X4V6P1Q8ZR",
    status: "processing",
    items: ["Office Chair", "Study Table"],
    total: "₹12,999",
    date: "Jan 18",
    estimatedDelivery: "Jan 20, 10-12 AM",
    itemCount: 2,
  },
];

export const USER_ADDRESSES = [
  {
    id: "1",
    type: "Home",
    name: "John Doe",
    address: "123 Main Street, Apt 4B",
    city: "New York, NY 10001",
    phone: "+1 (555) 123-4567",
    isDefault: true,
    icon: Home,
  },
  {
    id: "2",
    type: "Work",
    name: "John Doe",
    address: "456 Business Ave, Suite 200",
    city: "New York, NY 10002",
    phone: "+1 (555) 123-4567",
    isDefault: false,
    icon: Building2,
  },
];

export const HARDCODED_COUPONS = [
  {
    id: "WELCOME20",
    title: "Welcome Discount",
    description: "20% off on your first order",
    discount: 20,
    type: "percentage",
    minOrderValue: Math.round(500 / 85.82),
    expiryDate: "2025-12-31",
    applicable: true,
    savings: Math.round(150 / 85.82),
  },
  {
    id: "SAVE100",
    title: "Flat ₹100 Off",
    description: "Get ₹100 off on orders above ₹1000",
    discount: 100,
    type: "fixed",
    minOrderValue: Math.round(1000 / 85.82),
    expiryDate: "2025-10-30",
    applicable: true,
    savings: Math.round(100 / 85.82),
  },
  {
    id: "GROCERY15",
    title: "Grocery Special",
    description: "15% off on all grocery items",
    discount: 15,
    type: "percentage",
    minOrderValue: Math.round(300 / 85.82),
    expiryDate: "2025-08-15",
    applicable: true,
    savings: Math.round(75 / 85.82),
  },
  {
    id: "FREESHIP",
    title: "Free Shipping",
    description: "Free delivery on orders above ₹500",
    discount: 50,
    type: "shipping",
    minOrderValue: Math.round(500 / 85.82),
    expiryDate: "2025-12-31",
    applicable: true,
    savings: Math.round(50 / 85.82),
  },
  {
    id: "BULK250",
    title: "Bulk Order Discount",
    description: "₹250 off on orders above ₹2500",
    discount: 250,
    type: "fixed",
    minOrderValue: Math.round(2500 / 85.82),
    expiryDate: "2025-09-30",
    applicable: false,
    savings: 0,
  },
];

interface WalletOption {
  id: string;
  name: string;
  balance: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "paytm",
    name: "Paytm Wallet",
    balance: Math.round(1250 / 85.82),
    icon: SiPaytm,
    color: "bg-blue-500",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    balance: Math.round(850 / 85.82),
    icon: SiPhonepe,
    color: "bg-purple-500",
  },
  {
    id: "gpay",
    name: "Google Pay",
    balance: Math.round(420 / 85.82),
    icon: SiGooglepay,
    color: "bg-green-500",
  },
  {
    id: "paypal",
    name: "Paypal",
    balance: 0,
    icon: SiPaypal,
    color: "bg-orange-500",
  },
];
