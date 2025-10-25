import { NextRequest, NextResponse } from 'next/server'

// For now, we'll use in-memory storage for demo
let pengajuanCutiData: any[] = []

export async function GET() {
  try {
    return NextResponse.json(pengajuanCutiData)
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
    
    // Create new pengajuan cuti with ID and timestamp
    const newPengajuan = {
      id: Date.now().toString(),
      ...data,
      tanggalCuti: new Date(data.tanggalCuti),
      tanggalMulaiCuti: new Date(data.tanggalMulaiCuti),
      tanggalAkhirCuti: new Date(data.tanggalAkhirCuti),
      cutiPeriodikBerikutnya: data.cutiPeriodikBerikutnya ? new Date(data.cutiPeriodikBerikutnya) : null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to in-memory storage
    pengajuanCutiData.push(newPengajuan)

    return NextResponse.json({
      message: 'Pengajuan cuti berhasil disimpan',
      data: newPengajuan
    })
  } catch (error) {
    console.error('Error creating pengajuan cuti:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}