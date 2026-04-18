"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts"

// Sample data for sales by business
const monthlyData = [
  {
    month: "Jan",
    "Acme Corporation": 4200,
    "TechNova Solutions": 3100,
    "Green Earth Organics": 1500,
    "Stellar Fashion": 5200,
    "Bright Home Furnishings": 2800,
  },
  {
    month: "Feb",
    "Acme Corporation": 4500,
    "TechNova Solutions": 3300,
    "Green Earth Organics": 1600,
    "Stellar Fashion": 5500,
    "Bright Home Furnishings": 3000,
  },
  {
    month: "Mar",
    "Acme Corporation": 4800,
    "TechNova Solutions": 3600,
    "Green Earth Organics": 1800,
    "Stellar Fashion": 5800,
    "Bright Home Furnishings": 3200,
  },
  {
    month: "Apr",
    "Acme Corporation": 5100,
    "TechNova Solutions": 3900,
    "Green Earth Organics": 2000,
    "Stellar Fashion": 6100,
    "Bright Home Furnishings": 3400,
  },
  {
    month: "May",
    "Acme Corporation": 5400,
    "TechNova Solutions": 4200,
    "Green Earth Organics": 2200,
    "Stellar Fashion": 6400,
    "Bright Home Furnishings": 3600,
  },
  {
    month: "Jun",
    "Acme Corporation": 5700,
    "TechNova Solutions": 4500,
    "Green Earth Organics": 2400,
    "Stellar Fashion": 6700,
    "Bright Home Furnishings": 3800,
  },
]

const quarterlyData = [
  {
    quarter: "Q1",
    "Acme Corporation": 13500,
    "TechNova Solutions": 10000,
    "Green Earth Organics": 4900,
    "Stellar Fashion": 16500,
    "Bright Home Furnishings": 9000,
  },
  {
    quarter: "Q2",
    "Acme Corporation": 16200,
    "TechNova Solutions": 12600,
    "Green Earth Organics": 6600,
    "Stellar Fashion": 19200,
    "Bright Home Furnishings": 10800,
  },
]

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
  "hsl(var(--destructive))",
]

export function SalesByBusiness() {
  const [period, setPeriod] = useState("monthly")

  const data = period === "monthly" ? monthlyData : quarterlyData
  const keys = Object.keys(data[0]).filter((key) => key !== "month" && key !== "quarter")
  const xKey = period === "monthly" ? "month" : "quarter"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales by Business</CardTitle>
            <CardDescription>Comparing sales performance across businesses</CardDescription>
          </div>
          <Tabs defaultValue="monthly" value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                {keys.map((key, index) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
                ))}
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

