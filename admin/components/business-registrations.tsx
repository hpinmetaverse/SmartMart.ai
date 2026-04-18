"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for different time periods
const dailyData = [
  { date: "Mon", value: 12 },
  { date: "Tue", value: 8 },
  { date: "Wed", value: 15 },
  { date: "Thu", value: 10 },
  { date: "Fri", value: 18 },
  { date: "Sat", value: 5 },
  { date: "Sun", value: 3 },
]

const weeklyData = [
  { date: "Week 1", value: 45 },
  { date: "Week 2", value: 38 },
  { date: "Week 3", value: 52 },
  { date: "Week 4", value: 63 },
]

const monthlyData = [
  { date: "Jan", value: 120 },
  { date: "Feb", value: 145 },
  { date: "Mar", value: 132 },
  { date: "Apr", value: 178 },
  { date: "May", value: 190 },
  { date: "Jun", value: 210 },
  { date: "Jul", value: 245 },
  { date: "Aug", value: 230 },
  { date: "Sep", value: 280 },
  { date: "Oct", value: 310 },
  { date: "Nov", value: 325 },
  { date: "Dec", value: 340 },
]

export function BusinessRegistrations() {
  const [period, setPeriod] = useState("monthly")

  const data = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>New Business Registrations</CardTitle>
            <CardDescription>Number of new businesses registered over time</CardDescription>
          </div>
          <Tabs defaultValue="monthly" value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer>
              <BarChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

