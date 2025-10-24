import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const kontakHR = await db.kontakHR.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(kontakHR)
  } catch (error) {
    console.error('Error fetching kontak HR:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const kontakHR = await db.kontakHR.create({
      data: {
        ...data,
        userId: null // Will be updated when user authentication is implemented
      }
    })

    return NextResponse.json({
      message: 'Pesan berhasil dikirim',
      data: kontakHR
    })
  } catch (error) {
    console.error('Error creating kontak HR:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}