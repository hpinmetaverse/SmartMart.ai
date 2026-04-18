"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/providers/AuthProvider"
import supabaseClient from "@/lib/supabase/client"
import { getNameInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCard, LogOut, Package, Settings, ShoppingCart, Star, User } from "lucide-react"

function UserNav() {
  const router = useRouter()
  const { user } = useAuth()
  const [userPoints, setUserPoints] = useState(340)
  const [canClaimDaily, setCanClaimDaily] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const storedPoints = localStorage.getItem("userPoints") || "0"
    setUserPoints(Number.parseInt(storedPoints))

    const lastClaimed = localStorage.getItem("lastClaimed")
    if (lastClaimed) {
      const lastClaimedDate = new Date(lastClaimed)
      const today = new Date()
      if (
        lastClaimedDate.getDate() === today.getDate() &&
        lastClaimedDate.getMonth() === today.getMonth() &&
        lastClaimedDate.getFullYear() === today.getFullYear()
      ) {
        setCanClaimDaily(false)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("userPoints", userPoints.toString())
  }, [userPoints])

  const logout = () => {
    supabaseClient.auth.signOut()
    router.refresh()
  }

  const handleClaimDaily = () => {
    if (canClaimDaily) {
      setUserPoints((prevPoints) => prevPoints + 5)
      setCanClaimDaily(false)
      localStorage.setItem("lastClaimed", new Date().toISOString())
      toast({
        title: "Daily Coins Claimed!",
        description: "You've successfully claimed your daily 5 coins.",
      })
    } else {
      toast({
        title: "Already Claimed Today",
        description: "You can only claim your daily coins once a day.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <Link href="/sign-in" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
        <User className="h-4 w-4" />
        <span className="text-sm font-medium">Sign in</span>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-offset-2">
          <Avatar className="h-9 w-9 border border-primary/10">
            <AvatarImage src="/avatars/01.png" alt={getNameInitials((user.user_metadata.name as string) ?? "Name")} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {getNameInitials((user.user_metadata.name as string) ?? "Name")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex flex-col space-y-4 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.user_metadata.name || "Username"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <Link href="/setting/account" className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-yellow-200 fill-yellow-200" />
                <span className="text-sm font-semibold text-white">Mart Coins</span>
                </Link>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {userPoints}
              </Badge>
            </div>

            <Button
              onClick={handleClaimDaily}
              disabled={!canClaimDaily}
              size="sm"
              className="w-full bg-white/90 text-purple-700 hover:bg-white font-medium"
            >
              {canClaimDaily ? "Claim Daily +5 Coins" : "Claimed Today"}
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/orders">
            <DropdownMenuItem>
              <Package className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/wish-list">
            <DropdownMenuItem>
              <Star className="mr-2 h-4 w-4" />
              <span>Wishlist</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/cart">
            <DropdownMenuItem>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Cart</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/setting/account">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        {user.app_metadata.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Admin Controls</DropdownMenuLabel>
            <DropdownMenuGroup>
              <Link href="/admin">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserNav

