"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

// Sample data for business engagement
const weeklyData = [
  {
    week: "Week 1",
    "Acme Corporation": 85,
    "TechNova Solutions": 72,
    "Green Earth Organics": 45,
    "Stellar Fashion": 92,
    "Bright Home Furnishings": 63,
  },
  {
    week: "Week 2",
    "Acme Corporation": 88,
    "TechNova Solutions": 75,
    "Green Earth Organics": 48,
    "Stellar Fashion": 95,
    "Bright Home Furnishings": 67,
  },
  {
    week: "Week 3",
    "Acme Corporation": 92,
    "TechNova Solutions": 78,
    "Green Earth Organics": 52,
    "Stellar Fashion": 98,
    "Bright Home Furnishings": 70,
  },
  {
    week: "Week 4",
    "Acme Corporation": 90,
    "TechNova Solutions": 80,
    "Green Earth Organics": 55,
    "Stellar Fashion": 97,
    "Bright Home Furnishings": 73,
  },
  {
    week: "Week 5",
    "Acme Corporation": 94,
    "TechNova Solutions": 83,
    "Green Earth Organics": 58,
    "Stellar Fashion": 99,
    "Bright Home Furnishings": 76,
  },
  {
    week: "Week 6",
    "Acme Corporation": 96,
    "TechNova Solutions": 85,
    "Green Earth Organics": 60,
    "Stellar Fashion": 100,
    "Bright Home Furnishings": 78,
  },
  {
    week: "Week 7",
    "Acme Corporation": 95,
    "TechNova Solutions": 87,
    "Green Earth Organics": 62,
    "Stellar Fashion": 98,
    "Bright Home Furnishings": 80,
  },
  {
    week: "Week 8",
    "Acme Corporation": 97,
    "TechNova Solutions": 89,
    "Green Earth Organics": 65,
    "Stellar Fashion": 99,
    "Bright Home Furnishings": 82,
  },
]

const monthlyData = [
  {
    month: "Jan",
    "Acme Corporation": 82,
    "TechNova Solutions": 70,
    "Green Earth Organics": 42,
    "Stellar Fashion": 90,
    "Bright Home Furnishings": 60,
  },
  {
    month: "Feb",
    "Acme Corporation": 85,
    "TechNova Solutions": 73,
    "Green Earth Organics": 45,
    "Stellar Fashion": 93,
    "Bright Home Furnishings": 63,
  },
  {
    month: "Mar",
    "Acme Corporation": 88,
    "TechNova Solutions": 76,
    "Green Earth Organics": 48,
    "Stellar Fashion": 95,
    "Bright Home Furnishings": 66,
  },
  {
    month: "Apr",
    "Acme Corporation": 91,
    "TechNova Solutions": 79,
    "Green Earth Organics": 51,
    "Stellar Fashion": 97,
    "Bright Home Furnishings": 69,
  },
  {
    month: "May",
    "Acme Corporation": 94,
    "TechNova Solutions": 82,
    "Green Earth Organics": 54,
    "Stellar Fashion": 99,
    "Bright Home Furnishings": 72,
  },
  {
    month: "Jun",
    "Acme Corporation": 97,
    "TechNova Solutions": 85,
    "Green Earth Organics": 57,
    "Stellar Fashion": 100,
    "Bright Home Furnishings": 75,
  },
]

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
  "hsl(var(--destructive))",
]

export function BusinessEngagement() {
  const [period, setPeriod] = useState("weekly")
  const [selectedBusinesses, setSelectedBusinesses] = useState([
    "Acme Corporation",
    "TechNova Solutions",
    "Stellar Fashion",
  ])

  const data = period === "weekly" ? weeklyData : monthlyData
  const xKey = period === "weekly" ? "week" : "month"

  const toggleBusiness = (business) => {
    if (selectedBusinesses.includes(business)) {
      setSelectedBusinesses(selectedBusinesses.filter((b) => b !== business))
    } else {
      setSelectedBusinesses([...selectedBusinesses, business])
    }
  }

  const businesses = [
    "Acme Corporation",
    "TechNova Solutions",
    "Green Earth Organics",
    "Stellar Fashion",
    "Bright Home Furnishings",
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Business Engagement</CardTitle>
            <CardDescription>Login frequency and activity levels over time</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Tabs defaultValue="weekly" value={period} onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-wrap gap-1">
              {businesses.map((business) => (
                <button
                  key={business}
                  onClick={() => toggleBusiness(business)}
                  className={`text-xs px-2 py-1 rounded-full ${
                    selectedBusinesses.includes(business)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {business.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer>
              <LineChart data={data}>
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                {selectedBusinesses.map((business, index) => (
                  <Line
                    key={business}
                    type="monotone"
                    dataKey={business}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

