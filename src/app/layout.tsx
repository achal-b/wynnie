import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import CartProvider from "@/components/ui/cart-provider";
import { ChatProvider } from "@/contexts/ChatContext";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerHandler from "@/components/ServiceWorkerHandler";
import { PWAStatus } from "@/components/PWAStatus";
import { PWADebugInfo } from "@/components/PWADebugInfo";
import LenisScroll from "@/components/LenisScroll";
import { Transition } from "./transition";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Wynnie",
  description:
    "Your Everyday Genius. Your Walmart Companion. Wynnie is the intelligent agent that empowers you to do more, live better, and shop smarter.",
  keywords: [
    "Walmart",
    "shopping",
    "AI assistant",
    "Wynnie",
    "smart shopping",
    "groceries",
    "fashion",
    "convenience",
  ],
  authors: [{ name: "Walmart" }],
  creator: "Walmart",
  publisher: "Walmart",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // metadataBase: new URL("https://wynnie.walmart.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wynnie",
    description: "Your Everyday Genius. Your Walmart Companion.",
    // url: "https://wynnie.walmart.com",
    siteName: "Wynnie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wynnie",
    description: "Your Everyday Genius. Your Walmart Companion.",
    creator: "@walmart",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wynnie",
  },
  applicationName: "Wynnie",
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0071ce" },
    { media: "(prefers-color-scheme: dark)", color: "#004c87" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-title" content="Wynnie" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0071ce" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-config" content="none" />
        <meta
          name="msapplication-TileImage"
          content="/web-app-manifest-192x192.png"
        />

        {/* Format Detection */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="date=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="email=no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/web-app-manifest-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/web-app-manifest-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/web-app-manifest-192x192.png"
        />

        {/* Fallback Icons */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/web-app-manifest-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/web-app-manifest-192x192.png"
        />

        {/* iOS Splash Screens */}
        <link
          rel="apple-touch-startup-image"
          href="/web-app-manifest-512x512.png"
        />

        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            <CartProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <LenisScroll />
                <Transition>
                  {children}
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    className="custom-toast-container"
                    toastClassName="custom-toast"
                    // bodyClassName="custom-toast-body"
                  />
                  <PWAInstallPrompt />
                  <ServiceWorkerHandler />
                  <PWAStatus />
                  <PWADebugInfo />
                </Transition>
              </ThemeProvider>
            </CartProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
