import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departemen = searchParams.get('departemen')
    const search = searchParams.get('search')

    let whereClause: any = {}

    if (departemen && departemen !== 'all') {
      whereClause.departemen = departemen
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search, mode: 'insensitive' } },
        { jabatan: { contains: search, mode: 'insensitive' } },
        { departemen: { contains: search, mode: 'insensitive' } }
      ]
    }

    const karyawan = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        nik: true,
        jabatan: true,
        departemen: true,
        site: true,
        poh: true,
        statusKaryawan: true,
        noKtp: true,
        noTelp: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(karyawan)
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

    const karyawan = await db.user.create({
      data: {
        ...data,
        role: 'user'
      }
    })

    return NextResponse.json({
      message: 'Data karyawan berhasil ditambahkan',
      data: karyawan
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

    const karyawan = await db.user.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      message: 'Data karyawan berhasil diperbarui',
      data: karyawan
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

    await db.user.delete({
      where: { id }
    })

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