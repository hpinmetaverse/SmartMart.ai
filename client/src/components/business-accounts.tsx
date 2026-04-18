"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data for business accounts
const businesses = [
  {
    id: "B001",
    name: "Acme Corporation",
    status: "active",
    type: "Retail",
    joinDate: "2023-01-15",
  },
  {
    id: "B002",
    name: "TechNova Solutions",
    status: "active",
    type: "Technology",
    joinDate: "2023-02-22",
  },
  {
    id: "B003",
    name: "Green Earth Organics",
    status: "inactive",
    type: "Food & Beverage",
    joinDate: "2023-03-10",
  },
  {
    id: "B004",
    name: "Stellar Fashion",
    status: "active",
    type: "Apparel",
    joinDate: "2023-04-05",
  },
  {
    id: "B005",
    name: "Bright Home Furnishings",
    status: "pending",
    type: "Home Goods",
    joinDate: "2023-05-18",
  },
]

export function BusinessAccounts() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Business Accounts Overview</CardTitle>
        <CardDescription>Comprehensive list of all registered businesses</CardDescription>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search businesses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked>Show Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Show Inactive</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Show Pending</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.id}</TableCell>
                  <TableCell>{business.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        business.status === "active"
                          ? "default"
                          : business.status === "inactive"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {business.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{business.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{business.joinDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

