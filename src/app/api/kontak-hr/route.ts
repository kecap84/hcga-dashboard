import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo
let kontakHRData: any[] = []

export async function GET() {
  try {
    return NextResponse.json(kontakHRData)
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

    const newKontak = {
      id: Date.now().toString(),
      ...data,
      userId: null,
      status: 'unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    kontakHRData.push(newKontak)

    return NextResponse.json({
      message: 'Pesan berhasil dikirim',
      data: newKontak
    })
  } catch (error) {
    console.error('Error creating kontak HR:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}