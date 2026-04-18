"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClientComponentClient();

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) setMessage(error.message);
    else setMessage("Check your email for the reset link!");
  };

  return (
    <Card className="border-0 shadow-none max-w-md w-full mx-auto">
  <CardHeader className="space-y-1">
    <CardTitle className="text-2xl font-semibold text-gray-900">
      Reset Password
    </CardTitle>
    <CardDescription className="text-gray-500">
      Enter your email to receive a reset link
    </CardDescription>
  </CardHeader>

  <CardContent className="flex flex-col gap-4">
    <input
      type="email"
      placeholder="email@domain.com"
      className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <button
      onClick={handleReset}
      className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
    >
      Send Reset Link
    </button>

    {message && (
      <p className="text-sm text-gray-500 text-center">{message}</p>
    )}
  </CardContent>
</Card>
  );
}