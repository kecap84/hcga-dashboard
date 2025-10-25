import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo
let pengajuanTrainingData: any[] = []

export async function GET() {
  try {
    return NextResponse.json(pengajuanTrainingData)
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
    
    const newPengajuan = {
      id: Date.now().toString(),
      ...data,
      tanggalPelatihan: new Date(data.tanggalPelatihan),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    pengajuanTrainingData.push(newPengajuan)

    return NextResponse.json({
      message: 'Pengajuan training berhasil disimpan',
      data: newPengajuan
    })
  } catch (error) {
    console.error('Error creating pengajuan training:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}