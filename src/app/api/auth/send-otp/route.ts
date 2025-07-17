import { NextResponse } from "next/server";
import signupStore from "@/lib/otpStore";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  signupStore.set(email, {
    name,
    email,
    password,
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });

  const emailStatus = await sendEmail({
    to: email,
    from: process.env.EMAIL_FROM!,
    subject: "Your One-Time Password (OTP) for Signup",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fbd5d5; border-radius: 8px; background-color: #fff1f2;">
      <h2 style="color: #be123c;">Verify Your Email Address</h2>
      <p style="font-size: 16px; color: #881337;">
        Hello,<br />
        Use the following One-Time Password (OTP) to complete your verification. This code is valid for 5 minutes.
      </p>
      <div style="margin: 20px 0; text-align: center;">
        <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; color: #fff; background-color: #f43f5e; border-radius: 6px;">
          ${otp}
        </span>
      </div>
    </div>
  `,
  });

  return NextResponse.json({
    success: emailStatus,
    message: "OTP sent",
  });
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
    const response = await fetch(process.env.EMAIL_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
      },
      body: JSON.stringify({ to, from, subject, html, text }),
    });

    const result = await response.json();

    if (!result.success) {
      console.error("Failed to send mail:", result);
    }

    return !!result.success;
  } catch (error) {
    console.error("Email API error:", error);
    return false;
  }
}
