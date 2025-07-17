/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import signupStore from "@/lib/otpStore";

type RateLimitEntry = {
  count: number;
  expires: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const ip = getIP(req) ?? "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
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
    subject: "Verify Your Email - OTP Inside",
    html: getOTPEmailHTML(name, otp),
  });

  return NextResponse.json({
    success: emailStatus,
    message: emailStatus ? "OTP sent to your email." : "Failed to send OTP",
  });
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.expires < now) {
    rateLimitStore.set(ip, { count: 1, expires: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) return false;

  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return true;
}

function getIP(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const ip = (req as any).ip;
  return ip || null;
}

function getOTPEmailHTML(name: string, otp: string) {
  return `
 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
  
  <a href="https://showfolio.soorajrao.in" style="display: flex; align-items: center; gap: 8px; text-decoration: none;">
  <div
    style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #f43f5e, rgba(255, 91, 91, 0.7)); display: flex; align-items: center; justify-content: center;">
    <span style="font-weight: bold; color: #ffffff;">S</span>
  </div>
  <span style="font-weight: bold; font-size: 1.25rem; color: #333;">Showfolio</span>
</a>

    <h2 style="color: #f43f5e;margin-top: 2.5rem;">Hello, ${name}!</h2>
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
    if (!result.success) console.error("Email send failed:", result);
    return !!result.success;
  } catch (err) {
    console.error("Email API error:", err);
    return false;
  }
}
