"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Gift, Award, Sparkles, ChevronRight, Check, Lock } from "lucide-react"

type Props = {}

function AccountPage({}: Props) {
  const [progress, setProgress] = useState(32) // Example progress percentage
  const [claimed, setClaimed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storeprogress = localStorage.getItem("progress") || "0"
    setProgress(Number.parseInt(storeprogress))
    const storeClaimed = localStorage.getItem("Claimed") || "false"
    setClaimed(storeClaimed === "true")
  }, [])

  useEffect(() => {
    localStorage.setItem("progress", progress.toString())
    localStorage.setItem("Claimed", claimed.toString())
  }, [progress, claimed])

  const handleClaimRewards = () => {
    if (!claimed) {
      setIsAnimating(true)
      setTimeout(() => {
        setProgress(0)
        setClaimed(true)
        setIsAnimating(false)
        toast({
          title: "Gift Claimed!",
          description: "You have successfully claimed your gift!",
        })
      }, 1000)
    } else {
      toast({
        title: "Gift Already Claimed",
        description: "Your rewards is already at the end!",
        variant: "destructive",
      })
    }
  }

  const giftCards = [
    {
      name: "Amazon Gift Card",
      value: 5000,
      description: "Redeem for purchases on Amazon",
      icon: Gift,
      color: "bg-blue-500/10 text-blue-500",
      available: progress >= 50,
    },
    {
      name: "SmartMart Voucher",
      value: 2500,
      description: "Use at any SmartMart location",
      icon: Award,
      color: "bg-green-500/10 text-green-500",
      available: progress >= 25,
    },
    {
      name: "Starbucks Card",
      value: 10000,
      description: "Enjoy your favorite coffee drinks",
      icon: Sparkles,
      color: "bg-amber-500/10 text-amber-500",
      available: progress >= 100,
    },
  ]

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Rewards & Progress</h1>
        <p className="text-muted-foreground">Track your progress and redeem exciting rewards</p>
      </div>

      {/* Progress Bar Section */}
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Progress
          </CardTitle>
          <CardDescription className="text-white/80">Collect coins to unlock exclusive rewards</CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>

            <div className="relative pt-1">
              <Progress value={progress} className={`h-3 ${isAnimating ? "animate-pulse" : ""}`} />

              {/* Progress Milestones */}
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${progress >= 25 ? "bg-primary" : "bg-muted"}`}></div>
                  <span>25%</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${progress >= 50 ? "bg-primary" : "bg-muted"}`}></div>
                  <span>50%</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${progress >= 75 ? "bg-primary" : "bg-muted"}`}></div>
                  <span>75%</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${progress >= 100 ? "bg-primary" : "bg-muted"}`}></div>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">340 coins collected</p>
              <p className="text-sm text-muted-foreground">
                {progress < 100 ? `You are ${progress}% of the way there!` : "You've reached the maximum progress!"}
              </p>
            </div>

            {progress === 100 && (
              <Button
                onClick={handleClaimRewards}
                disabled={claimed || isAnimating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {claimed ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Claimed
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" /> Claim Rewards
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Gift Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Available Gift Cards</h2>
          <Badge variant="outline" className="px-3">
            {giftCards.filter((card) => card.available).length} Available
          </Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {giftCards.map((card) => (
            <Card
              key={card.name}
              className={`overflow-hidden transition-all duration-200 ${
                card.available ? "hover:shadow-lg hover:-translate-y-1" : "opacity-70"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  {!card.available && (
                    <Badge variant="outline" className="bg-muted">
                      <Lock className="h-3 w-3 mr-1" /> Locked
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-2">{card.name}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <span className="text-muted-foreground">Points Required:</span>
                  <span>{card.value.toLocaleString()}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={card.available ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  disabled={!card.available}
                >
                  {card.available ? "Redeem Now" : "Not Available"}
                  {card.available && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AccountPage

