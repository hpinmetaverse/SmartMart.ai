"use client"
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'

// Dummy data type
interface Seller {
  id: string
  name: string
  email: string
  storeTitle: string
  joinDate: string
  status: 'active' | 'suspended' | 'pending'
  productsCount: number
  avatar: string
}

// Dummy data
const sellers: Seller[] = [
  {
    id: '1',
    name: 'Sujal Vivek Choudhari',
    email: 'sjlchoudhari@gmail.com',
    storeTitle: 'Sujal Fashion',
    joinDate: '2024-01-15',
    status: 'active',
    productsCount: 45,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sujal'
  },
  // {
  //   id: '2',
  //   name: 'Jane Smith',
  //   email: 'jane@example.com',
  //   storeTitle: 'Fashion Hub',
  //   joinDate: '2024-02-20',
  //   status: 'pending',
  //   productsCount: 12,
  //   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  // },
  // Add more dummy data as needed
]

// Add this helper function at the top level
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export default function SellersListPage() {
  const router = useRouter();

  // Handle empty state
  if (sellers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h3 className="text-xl font-semibold">No Sellers Found</h3>
        <p className="text-muted-foreground">There are no sellers registered on the platform yet.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sellers List</h1>
        <p className="text-muted-foreground">Total Sellers: {sellers.length}</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow 
                key={seller.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/seller/dashboard?id=${seller.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={seller.avatar} alt={seller.name} />
                      <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{seller.name}</p>
                      <p className="text-sm text-muted-foreground">{seller.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{seller.storeTitle}</TableCell>
                <TableCell>{formatDate(seller.joinDate)}</TableCell>
                <TableCell>
                  <Badge variant={
                    seller.status === 'active' ? 'success' :
                    seller.status === 'suspended' ? 'destructive' : 'secondary'
                  }>
                    {seller.status}
                  </Badge>
                </TableCell>
                <TableCell>{seller.productsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
