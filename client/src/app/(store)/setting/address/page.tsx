import CartSection from "@/features/carts/components/CartSection";
import CartSectionSkeleton from "@/features/carts/components/CartSectionSkeleton";
import { createClient } from "@/lib/supabase/server";
import { Herr_Von_Muellerhoff } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function CartPage() {
  const cookieStore = cookies();
  const supabase = createClient({ cookieStore });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-2xl mt-10">
      <div className="grid gap-6">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">
        Add Address
        </h2>
        <p className="text-sm text-muted-foreground">
        Please provide your address details.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
          htmlFor="addressLine1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
          >
          Address Line 1
          </label>
          <input
          type="text"
          id="addressLine1"
          name="addressLine1"
          placeholder="123 Main St"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label
          htmlFor="addressLine2"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
          >
          Address Line 2
          </label>
          <input
          type="text"
          id="addressLine2"
          name="addressLine2"
          placeholder="Apt 4B"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
          htmlFor="state"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
          >
          State
          </label>
          <input
          type="text"
          id="state"
          name="state"
          placeholder="Maharashtra"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label
          htmlFor="pin"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
          >
          Pin Code
          </label>
          <input
          type="text"
          id="pin"
          name="pin"
          placeholder="90210"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CartPage;
