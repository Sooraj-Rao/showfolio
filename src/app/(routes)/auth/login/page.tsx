"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import TestCredentials from "@/components/main/auth/test-data";
import { SiteNav } from "@/components/main/home/site-nav";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(true);
  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent,
    emailParam: string,
    passwordParam: string
  ) => {
    e.preventDefault();
    setError("");

    if (!emailParam || !passwordParam) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", {
        email: emailParam,
        password: passwordParam,
      });

      if (response.status === 200) {
        router.push("/resume/dashboard");
      } else {
        throw new Error("Failed to login");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.error || "An unexpected error occurred");
    } else {
      setError("An unexpected error occurred");
    }
  };

  const handleUseDemoCredentials = (
    demoEmail: string,
    demoPassword: string
  ) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleSubmit(
      new Event("submit") as unknown as React.FormEvent,
      demoEmail,
      demoPassword
    );
  };

  const handleCloseTestCredentials = () => {
    setShowTestCredentials(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
       <SiteNav />
      {showTestCredentials && (
        <TestCredentials
          onUse={handleUseDemoCredentials}
          onClose={handleCloseTestCredentials}
        />
      )}
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, email, password)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
