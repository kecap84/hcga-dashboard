import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET() {
  try {
    const dokumen = await db.dokumen.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(dokumen)
  } catch (error) {
    console.error('Error fetching dokumen:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const nama = formData.get('nama') as string
    const kategori = formData.get('kategori') as string
    const subFolder = formData.get('subFolder') as string

    if (!file || !nama || !kategori) {
      return NextResponse.json(
        { error: 'File, nama, dan kategori harus diisi' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Create subfolder if specified
    let targetDir = uploadsDir
    if (subFolder) {
      targetDir = join(uploadsDir, subFolder)
      if (!existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true })
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const extension = originalName.split('.').pop()
    const fileName = `${timestamp}_${originalName}`
    const filePath = join(targetDir, fileName)

    // Write file
    await writeFile(filePath, buffer)

    // Save to database
    const relativePath = subFolder ? `uploads/${subFolder}/${fileName}` : `uploads/${fileName}`
    
    const dokumen = await db.dokumen.create({
      data: {
        nama,
        kategori,
        subFolder: subFolder || null,
        filePath: relativePath
      }
    })

    return NextResponse.json({
      message: 'Dokumen berhasil diunggah',
      data: dokumen
    })
  } catch (error) {
    console.error('Error uploading dokumen:', error)
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
        { error: 'ID dokumen harus disertakan' },
        { status: 400 }
      )
    }

    // Get dokumen info before deleting
    const dokumen = await db.dokumen.findUnique({
      where: { id }
    })

    if (!dokumen) {
      return NextResponse.json(
        { error: 'Dokumen tidak ditemukan' },
        { status: 404 }
      )
    }

    // Delete from database
    await db.dokumen.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Dokumen berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting dokumen:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}