"use client"

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { startupSignUpSchema } from '@/lib/validations/auth'
import { registerStartup } from '@/lib/actions/auth'
import { SECTORS, ENTITY_TYPES, LOOKING_FOR } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type FormData = z.infer<typeof startupSignUpSchema>

export default function StartupSignUp() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(startupSignUpSchema),
    defaultValues: {
      sector: [],
      lookingFor: [],
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await registerStartup(data)
      
      if (result.error) {
        throw new Error(result.error)
      }

      // Sign in the user
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      // Redirect to dashboard
      router.push('/startup/dashboard')

    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  const handleSectorChange = (sectorValue: typeof SECTORS[number]) => {
    const currentSectors = watch('sector') || []
    const updatedSectors = currentSectors.includes(sectorValue)
      ? currentSectors.filter(s => s !== sectorValue)
      : [...currentSectors, sectorValue]
    setValue('sector', updatedSectors)
  }

  const handleLookingForChange = (value: typeof LOOKING_FOR[number]) => {
    const current = watch('lookingFor') || []
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    setValue('lookingFor', updated)
  }

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = []
    
    switch (activeTab) {
      case 'basic':
        fieldsToValidate = ['email', 'password', 'startupName', 'contactName', 'contactNumber']
        break
      case 'startup':
        fieldsToValidate = ['founderName', 'founderDesignation', 'entityType', 'teamSize']
        break
      case 'additional':
        fieldsToValidate = ['startupMailId', 'sector', 'lookingFor', 'terms']
        break
    }

    const isValid = await trigger(fieldsToValidate)
    
    if (isValid) {
      switch (activeTab) {
        case 'basic':
          setActiveTab('startup')
          break
        case 'startup':
          setActiveTab('additional')
          break
      }
    }
  }

  const handleBack = () => {
    switch (activeTab) {
      case 'startup':
        setActiveTab('basic')
        break
      case 'additional':
        setActiveTab('startup')
        break
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create an account to explore more features on Cumma.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="startup">Startup Details</TabsTrigger>
          <TabsTrigger value="additional">Additional Info</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                {...register('email')}
                type="email"
                placeholder="Your Email"
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('password')}
                type="password"
                placeholder="Create Password"
                className="h-12"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('startupName')}
                type="text"
                placeholder="Startup Name"
                className="h-12"
              />
              {errors.startupName && (
                <p className="text-sm text-destructive">{errors.startupName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('contactName')}
                type="text"
                placeholder="Contact Name"
                className="h-12"
              />
              {errors.contactName && (
                <p className="text-sm text-destructive">{errors.contactName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('contactNumber')}
                type="tel"
                placeholder="Contact Number"
                className="h-12"
              />
              {errors.contactNumber && (
                <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="startup" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                {...register('founderName')}
                type="text"
                placeholder="Founder Name"
                className="h-12"
              />
              {errors.founderName && (
                <p className="text-sm text-destructive">{errors.founderName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('founderDesignation')}
                type="text"
                placeholder="Founder Designation"
                className="h-12"
              />
              {errors.founderDesignation && (
                <p className="text-sm text-destructive">{errors.founderDesignation.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Select
                onValueChange={(value) => setValue('entityType', value as FormData['entityType'])}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.entityType && (
                <p className="text-sm text-destructive">{errors.entityType.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('teamSize', { valueAsNumber: true })}
                type="number"
                placeholder="Team Size"
                className="h-12"
              />
              {errors.teamSize && (
                <p className="text-sm text-destructive">{errors.teamSize.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('dpiitNumber')}
                type="text"
                placeholder="DPIIT Number (Optional)"
                className="h-12"
              />
              {errors.dpiitNumber && (
                <p className="text-sm text-destructive">{errors.dpiitNumber.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register('address')}
                type="text"
                placeholder="Address (Optional)"
                className="h-12"
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="additional" className="space-y-6">
          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Input
                    {...register('startupMailId')}
                    type="email"
                    placeholder="Startup Email"
                    className="h-12"
                  />
                  {errors.startupMailId && (
                    <p className="text-sm text-destructive">{errors.startupMailId.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    {...register('website')}
                    type="url"
                    placeholder="Website (Optional)"
                    className="h-12"
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Input
                    {...register('linkedinStartupUrl')}
                    type="url"
                    placeholder="LinkedIn Company URL (Optional)"
                    className="h-12"
                  />
                  {errors.linkedinStartupUrl && (
                    <p className="text-sm text-destructive">{errors.linkedinStartupUrl.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    {...register('linkedinFounderUrl')}
                    type="url"
                    placeholder="Founder's LinkedIn URL (Optional)"
                    className="h-12"
                  />
                  {errors.linkedinFounderUrl && (
                    <p className="text-sm text-destructive">{errors.linkedinFounderUrl.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sectors Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Sectors</h3>
              <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-lg p-4">
                {SECTORS.map((sector) => (
                  <div key={sector} className="flex items-start space-x-3">
                    <Checkbox
                      id={sector}
                      checked={watch('sector')?.includes(sector)}
                      onCheckedChange={() => handleSectorChange(sector)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={sector}
                      className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {sector}
                    </label>
                  </div>
                ))}
              </div>
              {errors.sector && (
                <p className="text-sm text-destructive">{errors.sector.message}</p>
              )}
            </div>

            {/* Looking For Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Looking For</h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                {LOOKING_FOR.map((option) => (
                  <div key={option} className="flex items-start space-x-3">
                    <Checkbox
                      id={option}
                      checked={watch('lookingFor')?.includes(option)}
                      onCheckedChange={() => handleLookingForChange(option)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={option}
                      className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              {errors.lookingFor && (
                <p className="text-sm text-destructive">{errors.lookingFor.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 bg-muted/50 rounded-lg p-4">
                <Checkbox
                  id="terms"
                  onCheckedChange={(checked) => {
                    if (checked) setValue('terms', true)
                  }}
                  className="mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-tight text-muted-foreground"
                >
                  By signing up, you agree to our terms of service and privacy policy.
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-destructive">{errors.terms.message}</p>
              )}
            </div>
          </div>
        </TabsContent>

        <div className="flex gap-4 justify-end mt-6">
          {activeTab !== 'basic' && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-12"
            >
              Back
            </Button>
          )}
          
          {activeTab !== 'additional' ? (
            <Button
              type="button"
              onClick={handleNext}
              className="h-12"
            >
              Next <span className="ml-2">→</span>
            </Button>
          ) : (
            <LoadingButton type="submit" className="h-12" loading={isSubmitting}>
              Create Account <span className="ml-2">→</span>
            </LoadingButton>
          )}
        </div>
      </Tabs>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Go to Sign in
        </Link>
      </div>
    </form>
  )
} 