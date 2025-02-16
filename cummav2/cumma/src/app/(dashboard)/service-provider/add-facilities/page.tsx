'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { FacilityForm } from '@/components/forms/facility-form'
import { FacilityType } from '@/components/forms/types'
import { toast } from 'sonner'
import {
  Building2,
  Users,
  VideoIcon,
  Microscope,
  MonitorPlay,
  LayoutDashboard,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const facilityTypes = [
  {
    type: 'individual-cabin',
    title: 'Individual Cabin',
    description: 'Private office spaces for individuals or small teams',
    icon: Building2,
  },
  {
    type: 'coworking-spaces',
    title: 'Coworking Spaces',
    description: 'Shared workspace for professionals and teams',
    icon: Users,
  },
  {
    type: 'meeting-rooms',
    title: 'Meeting Rooms',
    description: 'Conference and meeting spaces for professional gatherings',
    icon: VideoIcon,
  },
  {
    type: 'bio-allied-labs',
    title: 'Bio Allied Labs',
    description: 'Laboratory spaces for biotechnology and life sciences',
    icon: Microscope,
  },
  {
    type: 'manufacturing-labs',
    title: 'Manufacturing Labs',
    description: 'Spaces for manufacturing and production',
    icon: Microscope,
  },
  {
    type: 'prototyping-labs',
    title: 'Prototyping Labs',
    description: 'Facilities for product development and prototyping',
    icon: Microscope,
  },
  {
    type: 'software',
    title: 'Software',
    description: 'Software tools and development environments',
    icon: MonitorPlay,
  },
  {
    type: 'saas-allied',
    title: 'SaaS Allied',
    description: 'Software as a Service and related tools',
    icon: MonitorPlay,
  },
  {
    type: 'raw-space-office',
    title: 'Raw Space (Office)',
    description: 'Unfurnished office spaces for customization',
    icon: LayoutDashboard,
  },
  {
    type: 'raw-space-lab',
    title: 'Raw Space (Lab)',
    description: 'Unfurnished laboratory spaces for customization',
    icon: LayoutDashboard,
  },
] as const

export default function AddFacilities() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<FacilityType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleTypeChange = (newType: FacilityType) => {
    setSelectedType(newType)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facilityType: selectedType,
          details: data,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create facility')
      }

      toast.success('Facility created successfully')
      setIsDialogOpen(false)
      setSelectedType(null)
      router.refresh()
    } catch (error) {
      console.error('Error creating facility:', error)
      toast.error('Failed to create facility')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add New Facilities</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a facility type to add to your services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilityTypes.map((facility) => (
          <Card
            key={facility.type}
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleTypeChange(facility.type as FacilityType)}
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <facility.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{facility.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {facility.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Add {facilityTypes.find(f => f.type === selectedType)?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedType && (
            <FacilityForm
              type={selectedType}
              onSubmit={handleSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 