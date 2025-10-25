import { NextRequest, NextResponse } from 'next/server'

// In-memory storage (same as main route)
let pengajuanCutiData: any[] = []

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID dan status harus disertakan' },
        { status: 400 }
      )
    }

    // Find the pengajuan
    const index = pengajuanCutiData.findIndex(item => item.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Pengajuan cuti tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update status
    pengajuanCutiData[index] = {
      ...pengajuanCutiData[index],
      status: status,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Status berhasil diperbarui',
      data: pengajuanCutiData[index]
    })
  } catch (error) {
    console.error('Error updating status:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}