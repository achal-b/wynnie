import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=()"
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.studio.nebius.com https://api.sarvam.ai https://api.perplexity.ai https://serpapi.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // HSTS in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Log suspicious requests
  const userAgent = request.headers.get("user-agent") || "";
  const suspiciousPatterns = [
    /curl/i,
    /wget/i,
    /python/i,
    /bot/i,
    /scanner/i,
    /sqlmap/i,
    /nikto/i,
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
    console.warn(`⚠️ Suspicious request detected:`, {
      userAgent,
      url: request.url,
      ip:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
      timestamp: new Date().toISOString(),
    });
  }

  // Block requests with suspicious query parameters
  const url = new URL(request.url);
  const suspiciousParams = [
    "union",
    "select",
    "drop",
    "delete",
    "insert",
    "update",
    "script",
    "javascript",
    "eval",
    "alert",
    "prompt",
    "../",
    "..\\",
    "/etc/",
    "/proc/",
    "/var/",
    "cmd=",
    "exec=",
    "system=",
    "shell=",
  ];

  const queryString = url.search.toLowerCase();
  const pathString = url.pathname.toLowerCase();

  for (const param of suspiciousParams) {
    if (queryString.includes(param) || pathString.includes(param)) {
      console.warn(`🚨 Blocked suspicious request:`, {
        url: request.url,
        suspiciousParam: param,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: "Request blocked for security reasons" },
        { status: 403 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
