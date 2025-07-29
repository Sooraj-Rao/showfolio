import connectDB from "@/lib/db";
import { redis } from "@/lib/redis";
import User from "@/models/user";
import { NextResponse } from "next/server";

const MAX_REQUESTS = 2;
const WINDOW_SECONDS = 300;

export async function POST(req: Request) {
  const body = await req.json();
  const email = body.email?.toLowerCase();
  const name = body.name || "User";
  const password = body.password;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const key = `rate_limit:otp:${email}`;
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    if (count > MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Too many OTP requests. Try again after 5 minutes." },
        { status: 429 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpData = {
      name,
      email,
      password,
      otp,
      expires: Date.now() + WINDOW_SECONDS * 1000,
    };

    await redis.set(`otp:${email}`, JSON.stringify(otpData), {
      ex: WINDOW_SECONDS,
    });

    const html = `
    <div style="max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color: #f43f5e; text-align: center;">Showfolio</h2>
      <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 16px;">
        Use the OTP below to verify your email address. It is valid for <strong>5 minutes</strong>.
      </p>
      <div style="margin: 24px 0; text-align: center;">
        <span style="display: inline-block; padding: 14px 28px; font-size: 24px; font-weight: bold; color: white; background-color: #f43f5e; border-radius: 8px;">
          ${otp}
        </span>
      </div>
    </div>
  `;

    const success = await sendEmail({
      to: email,
      from: "Showfolio <showfolio@mailory.site>",
      subject: "Signup OTP",
      html,
    });
    if (success) console.log(`OTP sent to ${email}: ${otp}`);
    return NextResponse.json({ success });
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: "Internal Server Error" });
  }
}

async function sendEmail({
  to,
  from,
  subject,
  html,
  text,
}: {
  to: string;
  from: string;
  subject: string;
  html?: string;
  text?: string;
}): Promise<boolean> {
  try {
    const response = await fetch(process.env.EMAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "mailory-authorization": `Bearer ${process.env.EMAIL_API_KEY}`,
      },
      body: JSON.stringify({ to, from, subject, html, text }),
    });

    const { success, error, messageId } = await response.json();

    if (!success || !messageId) {
      console.error("Failed to send mail:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email API error:", error);
    return false;
  }
}
