import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { redis } from "@/lib/redis";
import { setAuthCookie } from "../../helper/utils";

type OtpData = {
  name: string;
  email: string;
  password: string;
  otp: string;
  expires: number;
};

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

    const redisData = (await redis.get(`otp:${email}`)) as OtpData | null;
    if (!redisData) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 404 }
      );
    }


    if (redisData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    if (Date.now() > redisData.expires) {
      await redis.del(`signup:${email}`);
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(redisData.password, 10);

    const user = await User.create({
      name: redisData.name,
      email: redisData.email,
      password: hashedPassword,
      portfolio: redisData.name,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    await redis.del(`signup:${email}`);

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });

    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
