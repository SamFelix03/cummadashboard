import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import ServiceProvider from '@/models/ServiceProvider'
import mongoose from 'mongoose'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await connectDB()

    const profile = await ServiceProvider.findOne({ 
      userId: new mongoose.Types.ObjectId(session.user.id)
    })
      .select('-__v')
      .lean()

    if (!profile) {
      return new NextResponse('Profile not found', { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error in GET /api/service-provider/profile:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    await connectDB()

    const updatedProfile = await ServiceProvider.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(session.user.id) },
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-__v').lean()

    if (!updatedProfile) {
      return new NextResponse('Profile not found', { status: 404 })
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error in PATCH /api/service-provider/profile:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 