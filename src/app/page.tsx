"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    } else if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Optionally show a loading spinner here
  return null;
}
