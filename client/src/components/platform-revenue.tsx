"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  { category: "Subscription Fees", revenue: 275, fill: "var(--color-subscription)" },
  { category: "Transaction Fees", revenue: 200, fill: "var(--color-transaction)" },
  { category: "Advertising Revenue", revenue: 187, fill: "var(--color-advertising)" },
  { category: "Premium Features", revenue: 173, fill: "var(--color-premium)" },
  { category: "Other", revenue: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  subscription: {
    label: "Subscription Fees",
    color: "hsl(var(--chart-1))",
  },
  transaction: {
    label: "Transaction Fees",
    color: "hsl(var(--chart-2))",
  },
  advertising: {
    label: "Advertising Revenue",
    color: "hsl(var(--chart-3))",
  },
  premium: {
    label: "Premium Features",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function PlatformRevenue() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Platform Revenue</CardTitle>
        <CardDescription>Revenue trends and distribution by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="category" />}
            />
            <Pie data={chartData} dataKey="revenue" nameKey="category">
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) => value}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

    </Card>
  )
}
