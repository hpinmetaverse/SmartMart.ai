"use client"

import * as React from "react"
import type { ChartTooltipProps } from "recharts"

export const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className="w-full h-full" {...props} />,
)
ChartContainer.displayName = "ChartContainer"

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ active, payload, label, ...props }, ref) => {
    if (!active || !payload) {
      return null
    }

    return (
      <div ref={ref} className="rounded-lg border bg-background p-2 shadow-sm" {...props}>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{label}</span>
            {payload.map((item, index) => (
              <span key={index} className="font-bold text-sm">
                {typeof item.value === "number"
                  ? item.name === "rate"
                    ? `${item.value}%`
                    : new Intl.NumberFormat("en-US", {
                        style: item.name === "sales" || item.name === "revenue" ? "currency" : "decimal",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.value)
                  : item.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

