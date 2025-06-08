import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // To verify the JWT token
import { NextRequest } from "next/server";

// The JWT secret used for signing the token (this should be in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "";

export async function middleware(req: NextRequest) {
  try {
    // Check if the request is to the "auth/login" route
    if (req.nextUrl.pathname === "/auth/login") {
      // Extract the token from the request cookies
      const token = req.cookies.get("token");

      // If token exists, redirect to home or any other page as they are already authenticated
      if (token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Extract the token from the request cookies for other routes
    const token = req.cookies.get("token");

    // Verify the JWT token and extract the user ID
    const { payload } = await jwtVerify(
      token?.value || "",
      new TextEncoder().encode(JWT_SECRET)
    );
    const userId = payload.userId as string;

    // Create a response and add the user ID as a header
    const response = NextResponse.next();
    response.headers.set("x-user-id", userId);

    return response; // Return the response with the user ID set
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/user", "/api/resume", "/api/analytics"],
};
