'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StartupBookings() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and manage your facility bookings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We're working on bringing you a comprehensive booking management system.
            Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 