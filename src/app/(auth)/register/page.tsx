"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { TbBrandWalmart, TbBrandGoogle } from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";

export default function Signup() {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    const ok = await register(name, value, otp);
    if (ok) {
      router.push("/login");
    } else {
      setError("User already exists or registration failed.");
    }
  };

  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-y-8">
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
              Sign up to start your intelligent shopping experience using
              Agentic AI
            </p>
          </div>
          <div className=" border-muted bg-background flex w-[95%] flex-col gap-8 rounded-md border px-6 py-12 shadow-md">
            <div className="flex flex-col gap-6 ">
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
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
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
                    disabled={!value || !name}
                  >
                    Send OTP
                  </Button>

                  {/* already have an account */}
                  <div className="flex justify-center">
                    <Link href="/login" className="text-sm text-foreground/80">
                      Already have an account?
                      <span className="text-primary font-medium hover:underline ml-1">
                        Login
                      </span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="otp">Enter OTP (use as password)</Label>
                    <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                      {[...Array(6)].map((_, idx) => (
                        <InputOTPSlot key={idx} index={idx} />
                      ))}
                    </InputOTP>
                  </div>
                  <Button
                    className="w-full mt-2"
                    disabled={otp.length !== 6}
                    onClick={handleRegister}
                  >
                    Create Account
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
