import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = await db.webSettings.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const settingsData = await request.json()

    // Update or create each setting
    const updates = Object.entries(settingsData).map(async ([key, value]) => {
      await db.webSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    })

    await Promise.all(updates)

    return NextResponse.json({
      message: 'Pengaturan berhasil disimpan',
      data: settingsData
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}