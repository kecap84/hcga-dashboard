import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo
let karyawanData: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departemen = searchParams.get('departemen')
    const search = searchParams.get('search')

    let filtered = karyawanData

    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.nik.toLowerCase().includes(search.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(search.toLowerCase()) ||
        item.departemen.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (departemen && departemen !== 'all') {
      filtered = filtered.filter(item => item.departemen === departemen)
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching data karyawan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newKaryawan = {
      id: Date.now().toString(),
      ...data,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    karyawanData.push(newKaryawan)

    return NextResponse.json({
      message: 'Data karyawan berhasil ditambahkan',
      data: newKaryawan
    })
  } catch (error) {
    console.error('Error creating karyawan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    const index = karyawanData.findIndex(item => item.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      )
    }

    karyawanData[index] = {
      ...karyawanData[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Data karyawan berhasil diperbarui',
      data: karyawanData[index]
    })
  } catch (error) {
    console.error('Error updating karyawan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID karyawan harus disertakan' },
        { status: 400 }
      )
    }

    const index = karyawanData.findIndex(item => item.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Karyawan tidak ditemukan' },
        { status: 404 }
      )
    }

    karyawanData.splice(index, 1)

    return NextResponse.json({
      message: 'Data karyawan berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting karyawan:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}