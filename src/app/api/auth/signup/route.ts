import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { setAuthCookie } from "../../helper/utils";
import signupStore from "@/lib/otpStore";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const tempData = signupStore.get(email);
    if (!tempData) {
      return NextResponse.json(
        { error: "No signup request found" },
        { status: 404 }
      );
    }

    if (tempData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    if (Date.now() > tempData.expires) {
      signupStore.delete(email);
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(tempData.password, 10);

    const user = await User.create({
      name: tempData.name,
      email: tempData.email,
      password: hashedPassword,
      portfolio: tempData.name,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    signupStore.delete(email); 

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
