import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; 
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function middleware(req: NextRequest) {
  try {
    if (req.nextUrl.pathname === "/auth/login") {
      const token = req.cookies.get("token");

      if (token) {
        return NextResponse.redirect(new URL("/resume/dashboard", req.url));
      }
    }

    const token = req.cookies.get("token");

    const { payload } = await jwtVerify(
      token?.value || "",
      new TextEncoder().encode(JWT_SECRET)
    );
    const userId = payload.userId as string;

    const response = NextResponse.next();
    response.headers.set("x-user-id", userId);

    return response; 
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    "/api/user",
    "/api/resume",
    "/api/analytics",
    "/api/portfolio/portfolio-data",
    "/api/portfolio/analytics/get",
  ],
};
