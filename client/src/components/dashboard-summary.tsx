import { ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingBag, Store } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const summaryCards = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    description: "from last month",
    icon: DollarSign,
  },
  {
    title: "Active Businesses",
    value: "2,350",
    change: "+18.2%",
    trend: "up",
    description: "from last month",
    icon: Store,
  },
  {
    title: "Total Sales",
    value: "12,234",
    change: "+4.3%",
    trend: "up",
    description: "from last month",
    icon: ShoppingBag,
  },
  {
    title: "New Customers",
    value: "573",
    change: "-2.5%",
    trend: "down",
    description: "from last month",
    icon: Users,
  },
]

export function DashboardSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-flex items-center font-medium",
                  card.trend === "up" ? "text-green-600" : "text-red-600",
                )}
              >
                {card.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                {card.change}
              </span>{" "}
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

