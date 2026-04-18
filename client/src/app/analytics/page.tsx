"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Download,
  Edit,
  Filter,
  Package,
  Search,
  TrendingUp,
  Users,
} from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, LabelList, RadialBar, RadialBarChart } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Revenue data for line chart
const revenueData = [
  { month: "January", revenue: 18600 },
  { month: "February", revenue: 30500 },
  { month: "March", revenue: 23700 },
  { month: "April", revenue: 27300 },
  { month: "May", revenue: 32900 },
  { month: "June", revenue: 41400 },
]

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "black",
  },
} satisfies ChartConfig

// Revenue breakdown data for radial chart
const revenueBreakdownData = [
  { category: "electronics", revenue: 275000, fill: "hsl(var(--chart-1))" },
  { category: "clothing", revenue: 200000, fill: "hsl(var(--chart-2))" },
  { category: "home", revenue: 187000, fill: "hsl(var(--chart-3))" },
  { category: "beauty", revenue: 173000, fill: "hsl(var(--chart-4))" },
  { category: "other", revenue: 90000, fill: "hsl(var(--chart-5))" },
]

const revenueBreakdownConfig = {
  revenue: {
    label: "Revenue",
  },
  electronics: {
    label: "Electronics",
    color: "hsl(var(--chart-1))",
  },
  clothing: {
    label: "Clothing",
    color: "hsl(var(--chart-2))",
  },
  home: {
    label: "Home Goods",
    color: "hsl(var(--chart-3))",
  },
  beauty: {
    label: "Beauty",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

// Product data for table
const products = [
  {
    id: "PROD-001",
    name: "Wireless Earbuds Pro",
    price: 129.99,
    stock: 45,
    category: "Electronics",
  },
  {
    id: "PROD-002",
    name: "Smart Watch Series 5",
    price: 249.99,
    stock: 32,
    category: "Electronics",
  },
  {
    id: "PROD-003",
    name: "Premium Cotton T-Shirt",
    price: 24.99,
    stock: 120,
    category: "Clothing",
  },
  {
    id: "PROD-004",
    name: "Ergonomic Office Chair",
    price: 199.99,
    stock: 18,
    category: "Home",
  },
  {
    id: "PROD-005",
    name: "Organic Face Serum",
    price: 39.99,
    stock: 65,
    category: "Beauty",
  },
  {
    id: "PROD-006",
    name: "Bluetooth Speaker",
    price: 79.99,
    stock: 28,
    category: "Electronics",
  },
  {
    id: "PROD-007",
    name: "Slim Fit Jeans",
    price: 49.99,
    stock: 87,
    category: "Clothing",
  },
  {
    id: "PROD-008",
    name: "Memory Foam Pillow",
    price: 34.99,
    stock: 53,
    category: "Home",
  },
]

// Customer data for table
const customers = [
  {
    id: "CUST-001",
    name: "Emma Johnson",
    totalSpent: 1245.67,
    lastPurchase: "2023-06-15",
    orders: 12,
  },
  {
    id: "CUST-002",
    name: "James Smith",
    totalSpent: 987.5,
    lastPurchase: "2023-06-10",
    orders: 8,
  },
  {
    id: "CUST-003",
    name: "Sophia Williams",
    totalSpent: 1876.34,
    lastPurchase: "2023-06-18",
    orders: 15,
  },
  {
    id: "CUST-004",
    name: "Michael Brown",
    totalSpent: 756.2,
    lastPurchase: "2023-06-05",
    orders: 6,
  },
  {
    id: "CUST-005",
    name: "Olivia Davis",
    totalSpent: 2134.89,
    lastPurchase: "2023-06-20",
    orders: 18,
  },
]

export default function Analytics() {
  const [timeInterval, setTimeInterval] = useState("monthly")
  const [searchProduct, setSearchProduct] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter and sort products
  const filteredProducts = products
    .filter(
      (product) =>
        (categoryFilter === "All" || product.category === categoryFilter) &&
        product.name.toLowerCase().includes(searchProduct.toLowerCase()),
    )
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a]
      const bValue = b[sortColumn as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else {
        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number)
      }
    })

  // Sort customers by total spent
  const sortedCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
     
      <main className="flex-1 space-y-6 p-6">
        {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$925,200</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">+12.5%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,842</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">+8.2%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">+5.7%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$240.82</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">+3.1%</span> from last month
              </div>
            </CardContent>
          </Card>
        </div> */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Total Platform Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Total Platform Revenue</CardTitle>
              <CardDescription>January - June 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig}>
                <LineChart
                  accessibilityLayer
                  data={revenueData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent formatter={(value) => `$${value.toLocaleString()}`} />}
                  />
                  <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={true} />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 12.5% this month <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing {timeInterval} revenue for the last 6 months
              </div>
            </CardFooter>
          </Card>

          {/* Revenue Breakdown Chart */}
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>By Product Category</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer config={revenueBreakdownConfig} className="mx-auto aspect-square max-h-[250px]">
                <RadialBarChart
                  data={revenueBreakdownData}
                  startAngle={-90}
                  endAngle={380}
                  innerRadius={30}
                  outerRadius={110}
                >
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        nameKey="category"
                        formatter={(value) => `$${(value / 1000).toLocaleString()}k`}
                      />
                    }
                  />
                  <RadialBar dataKey="revenue" background>
                    <LabelList
                      position="insideStart"
                      dataKey="category"
                      className="fill-white capitalize mix-blend-luminosity"
                      fontSize={11}
                    />
                  </RadialBar>
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Electronics category up by 8.7% <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="leading-none text-muted-foreground">Showing total revenue by product category</div>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Top Customers
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Product Listings</h2>
                <div className="text-sm text-muted-foreground">{filteredProducts.length} products</div>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 md:w-[200px] lg:w-[300px]"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={categoryFilter === "All"}
                      onCheckedChange={() => setCategoryFilter("All")}
                    >
                      All Categories
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={categoryFilter === "Electronics"}
                      onCheckedChange={() => setCategoryFilter("Electronics")}
                    >
                      Electronics
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={categoryFilter === "Clothing"}
                      onCheckedChange={() => setCategoryFilter("Clothing")}
                    >
                      Clothing
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={categoryFilter === "Home"}
                      onCheckedChange={() => setCategoryFilter("Home")}
                    >
                      Home
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={categoryFilter === "Beauty"}
                      onCheckedChange={() => setCategoryFilter("Beauty")}
                    >
                      Beauty
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("stock")}>
                      Stock
                      <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`${product.stock < 20 ? "text-red-500" : product.stock < 50 ? "text-yellow-500" : "text-green-500"}`}
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Top Customers</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Filter by Date
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Last Purchase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{new Date(customer.lastPurchase).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

