"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { TbBrandGoogle, TbBrandWalmart } from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";

export default function Login2() {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    const ok = await login(value, otp);
    if (ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-[90%] max-w-sm flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-2">
            <div className="flex items-center gap-1 lg:justify-start">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <TbBrandWalmart className="size-12 text-walmart-logo-secondary" />
                </div>
              </Link>
            </div>
            <h1 className="text-3xl font-semibold text-center">
              Welcome to Wynnie
            </h1>
            <p className="text-foreground/80 text-sm text-center">
              Sign in to start your intelligent shopping experience using
              Agentic AI
            </p>
          </div>
          <div className="border-muted bg-background flex w-[95%] flex-col gap-8 rounded-xl border px-6 py-12 shadow-md">
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 flex-col">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <TbBrandWalmart className="size-5" />
                  Continue with Walmart
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <TbBrandGoogle className="size-5" />
                  Continue with Google
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-muted-foreground/30" />
                <span className="text-xs text-foreground/80">
                  OR CONTINUE WITH
                </span>
                <div className="flex-1 h-px bg-muted-foreground/30" />
              </div>
              {step === "input" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="emailOrPhone">
                      Enter email or phone number
                    </Label>
                    <Input
                      id="emailOrPhone"
                      type="text"
                      placeholder="Enter email or phone number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <Button
                    className="w-full mt-2"
                    onClick={() => setStep("otp")}
                    disabled={!value}
                  >
                    Send OTP
                  </Button>

                  {/* already have an account */}
                  <div className="flex justify-center">
                    <Link
                      href="/register"
                      className="text-sm text-foreground/80"
                    >
                      Don&apos;t have an account?
                      <span className="text-primary font-medium hover:underline ml-1">
                        Sign up
                      </span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="otp">Enter OTP (use as password)</Label>
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      {[...Array(6)].map((_, idx) => (
                        <InputOTPSlot key={idx} index={idx} />
                      ))}
                    </InputOTP>
                  </div>
                  <Button
                    className="w-full mt-2"
                    disabled={otp.length !== 6}
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
