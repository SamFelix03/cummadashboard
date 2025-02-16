'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ProfilePicture } from '@/components/ui/profile-picture'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ENTITY_TYPES, SECTORS, LOOKING_FOR } from '@/lib/constants'
import { toast } from 'sonner'

interface StartupProfile {
  startupName: string
  contactName: string
  contactNumber: string
  founderName: string
  founderDesignation: string
  entityType: string
  teamSize: number
  dpiitNumber: string | null
  sector: string[] | null
  startupMailId: string
  website: string | null
  linkedinStartupUrl: string | null
  linkedinFounderUrl: string | null
  lookingFor: string[] | null
  address: string | null
  logoUrl: string | null
}

export default function StartupProfile() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<StartupProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/startup/profile')
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async (formData: StartupProfile) => {
    try {
      const response = await fetch('/api/startup/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your startup profile and settings
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit}>
            Edit Profile
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfilePicture
                imageUrl={profile.logoUrl}
                size={128}
                isEditing={isEditing}
                onImageChange={(urls) => handleSave({ ...profile, logoUrl: urls[0] })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Startup Name</Label>
                  <Input
                    value={profile.startupName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, startupName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Entity Type</Label>
                  <Select
                    value={profile.entityType}
                    disabled={!isEditing}
                    onValueChange={(value) => setProfile({ ...profile, entityType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENTITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <Input
                    type="number"
                    value={profile.teamSize}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, teamSize: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>DPIIT Number</Label>
                  <Input
                    value={profile.dpiitNumber || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, dpiitNumber: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={profile.contactName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, contactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    value={profile.contactNumber}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Founder Name</Label>
                  <Input
                    value={profile.founderName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, founderName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Founder Designation</Label>
                  <Input
                    value={profile.founderDesignation}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, founderDesignation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Startup Email</Label>
                  <Input
                    type="email"
                    value={profile.startupMailId}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, startupMailId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={profile.address || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={profile.website || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn Company URL</Label>
                  <Input
                    value={profile.linkedinStartupUrl || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, linkedinStartupUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Founder's LinkedIn URL</Label>
                  <Input
                    value={profile.linkedinFounderUrl || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, linkedinFounderUrl: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={() => handleSave(profile)}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
} 