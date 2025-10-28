import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define your protected routes
const isProtectedRoute = createRouteMatcher([
  "/result(.*)",
  "/history(.*)",
  "/logout(.*)",
  "/profile(.*)",
  "/upload(.*)",
]);

// 2. Define routes that are only for signed-out users
const isGuestRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const authResult = await auth();
  const { userId } = authResult;

  // If the user is signed in...
  if (userId) {
    // ...and they try to access a "guest-only" route (like sign-in)...
    if (isGuestRoute(req)) {
      // ...redirect them to their profile (or dashboard).
      // UPDATE THIS to your main app page
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // If they are on a protected route, they are allowed to proceed.
    if (isProtectedRoute(req)) {
      return NextResponse.next();
    }
  }
  // If the user is signed out...
  else {
    // ...and they try to access a protected route...
    if (isProtectedRoute(req)) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("returnBackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // If they are on a guest route (like sign-in), they are allowed to proceed.
    if (isGuestRoute(req)) {
      return NextResponse.next();
    }
  }

  // Allow all other routes (like your homepage '/') to be accessed
  // by both signed-in and signed-out users.
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
