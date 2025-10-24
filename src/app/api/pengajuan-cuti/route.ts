import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const pengajuanCuti = await db.pengajuanCuti.findMany({
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

    return NextResponse.json(pengajuanCuti)
  } catch (error) {
    console.error('Error fetching pengajuan cuti:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const pengajuanCuti = await db.pengajuanCuti.create({
      data: {
        ...data,
        tanggalCuti: new Date(data.tanggalCuti),
        tanggalMulaiCuti: new Date(data.tanggalMulaiCuti),
        tanggalAkhirCuti: new Date(data.tanggalAkhirCuti),
        cutiPeriodikBerikutnya: data.cutiPeriodikBerikutnya ? new Date(data.cutiPeriodikBerikutnya) : null
      }
    })

    return NextResponse.json({
      message: 'Pengajuan cuti berhasil disimpan',
      data: pengajuanCuti
    })
  } catch (error) {
    console.error('Error creating pengajuan cuti:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}