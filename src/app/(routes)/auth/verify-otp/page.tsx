"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteNav } from "@/components/main/home/site-nav";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (otp.length !== 6 || /\D/.test(otp)) {
      setMessage("❌ Enter a valid 6-digit numeric OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ OTP verified!");
        router.push("/resume/dashboard");
      } else {
        setMessage(`❌ ${data.error || "Verification failed"}`);
      }
    } catch {
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
      <SiteNav />
      <Card className="w-[350px] sm:w-[450px] mt-24 shadow-xl border rounded-lg">
        <CardContent className="p-6">
          <CardTitle className="text-center text-xl font-semibold mb-6">
            Verify OTP
          </CardTitle>
          <form onSubmit={handleVerify} className="space-y-6">
            <InputOTP
              maxLength={6}
              value={otp}
              autoFocus
              onChange={(value) => {
                if (/^\d*$/.test(value)) {
                  setOTP(value);
                }
              }}
              disabled={loading}
              className="mx-auto flex justify-center"
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            {message && (
              <p className="text-center text-sm font-medium text-muted-foreground">
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
