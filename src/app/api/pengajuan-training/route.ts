import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const pengajuanTraining = await db.pengajuanTraining.findMany({
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

    return NextResponse.json(pengajuanTraining)
  } catch (error) {
    console.error('Error fetching pengajuan training:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const pengajuanTraining = await db.pengajuanTraining.create({
      data: {
        ...data,
        tanggalPelatihan: new Date(data.tanggalPelatihan)
      }
    })

    return NextResponse.json({
      message: 'Pengajuan training berhasil disimpan',
      data: pengajuanTraining
    })
  } catch (error) {
    console.error('Error creating pengajuan training:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}