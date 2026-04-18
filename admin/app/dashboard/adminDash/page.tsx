"use client"

import { BusinessRegistrations } from "@/components/business-registrations"
import { BusinessAccounts } from "@/components/business-accounts"
import { BusinessActivity } from "@/components/business-activity"



import { SalesByBusiness } from "@/components/sales-by-business"
import ConversionRates  from "@/components/conversion-rates"
import { BusinessEngagement } from "@/components/business-engagement"
import { DashboardSummary } from "@/components/dashboard-summary"
import TopBusinesses from "@/components/top-businesses"
import TotalSales from "@/components/total-sales"
import PlatformRevenue from "@/components/platform-revenue"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
   
      <div className="flex-1">
       
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <DashboardSummary />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full lg:col-span-2">
                {/* <BusinessRegistrations /> */}
              </div>
              {/* <div className="col-span-full lg:col-span-1">
                <TopBusinesses />
              </div> */}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <TotalSales/>
              <PlatformRevenue/>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
            <TopBusinesses />
          
              <ConversionRates /> 
            </div>
            {/* <BusinessEngagement /> */}
            <div className="grid gap-6 md:grid-cols-2">
              <BusinessAccounts />
              <BusinessActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

