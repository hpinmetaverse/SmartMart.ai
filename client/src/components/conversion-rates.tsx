"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { date: "2024-07-15", converted: 450, notConverted: 300 },
    { date: "2024-07-16", converted: 380, notConverted: 420 },
    { date: "2024-07-17", converted: 520, notConverted: 120 },
    { date: "2024-07-18", converted: 140, notConverted: 550 },
    { date: "2024-07-19", converted: 600, notConverted: 350 },
    { date: "2024-07-20", converted: 480, notConverted: 400 },
  ]

const chartConfig = {
  converted: {
    label: "Converted",
    color: "hsl(var(--chart-1))",
  },
  notConverted: {
    label: "Not Converted",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function ConversionRates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Conversion Rates</CardTitle>
        <CardDescription>
          Customers converted and not converted over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
            />
            <Bar
              dataKey="converted"
              stackId="a"
              fill="#000000"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="notConverted"
              stackId="a"
              fill="#d7d7d7"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
