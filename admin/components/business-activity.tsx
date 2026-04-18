"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data for business activity
const businessActivity = [
  {
    id: "B001",
    name: "Acme Corporation",
    productsListed: 145,
    lastLogin: "2023-06-15",
    avgSales: "₹12,450",
    activityLevel: "high",
  },
  {
    id: "B002",
    name: "TechNova Solutions",
    productsListed: 87,
    lastLogin: "2023-06-14",
    avgSales: "₹8,320",
    activityLevel: "medium",
  },
  {
    id: "B003",
    name: "Green Earth Organics",
    productsListed: 32,
    lastLogin: "2023-05-28",
    avgSales: "₹3,150",
    activityLevel: "low",
  },
  {
    id: "B004",
    name: "Stellar Fashion",
    productsListed: 215,
    lastLogin: "2023-06-15",
    avgSales: "₹15,780",
    activityLevel: "high",
  },
  {
    id: "B005",
    name: "Bright Home Furnishings",
    productsListed: 64,
    lastLogin: "2023-06-10",
    avgSales: "₹7,430",
    activityLevel: "medium",
  },
]

export function BusinessActivity() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Business Activity</CardTitle>
        <CardDescription>Key activity metrics for each business</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="hidden md:table-cell">Last Login</TableHead>
                <TableHead>Avg Sales</TableHead>
                <TableHead>Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businessActivity.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>{business.productsListed}</TableCell>
                  <TableCell className="hidden md:table-cell">{business.lastLogin}</TableCell>
                  <TableCell>{business.avgSales}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        business.activityLevel === "high"
                          ? "default"
                          : business.activityLevel === "medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {business.activityLevel}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

