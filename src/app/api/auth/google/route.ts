import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { setAuthCookie } from "../../helper/utils";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, name, photoURL, uid } = await req.json();

    if (!email || !name || !uid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = uid;
        user.imageUrl = photoURL || user.imageUrl;
        user.provider = "google";
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId: uid,
        imageUrl: photoURL || "",
        provider: "google",
        portfolio: name.toLowerCase().replace(/\s+/g, ""),
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for Google users
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
