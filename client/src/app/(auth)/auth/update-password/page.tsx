"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  
    const supabase = createClientComponentClient();
    const router = useRouter();
  
    const handleUpdate = async () => {
      const { error } = await supabase.auth.updateUser({ password });
  
      if (error) setMessage(error.message);
      else {
        setMessage("Password updated successfully!");
        router.push("/sign-in");
      }
    };
  
    return (
      <Card className="border-0 shadow-none max-w-md w-full mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Set New Password
          </CardTitle>
        </CardHeader>
  
        <CardContent className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="h-12 w-full rounded-lg border border-gray-300 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
  
            {/* Eye Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
  
          <button
            onClick={handleUpdate}
            className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Update Password
          </button>
  
          {message && (
            <p className="text-sm text-gray-500 text-center">{message}</p>
          )}
        </CardContent>
      </Card>
    );
  }