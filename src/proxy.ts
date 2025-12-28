import { type NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard"];

// unauthenticated users can access
const authPaths = ["/sign-in"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected or auth-only
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Skip middleware for non-relevant paths
  if (!isProtectedPath && !isAuthPath) {
    return NextResponse.next();
  }

  // Get session cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // Redirect unauthenticated users from protected routes to sign-in
  if (isProtectedPath && !sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthPath && sessionCookie) {
    if (request.nextUrl.searchParams.get("error") === "session") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
