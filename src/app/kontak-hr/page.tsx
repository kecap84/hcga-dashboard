'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, HelpCircle, Send, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function KontakHRPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/kontak-hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Pesan berhasil dikirim!",
          description: "Tim HR akan segera merespon pesan Anda",
        })
        
        // Reset form
        setFormData({
          nama: '',
          email: '',
          subjek: '',
          pesan: ''
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal mengirim pesan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Terjadi kesalahan server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali</span>
            </Link>
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
              Kontak HR / Helpdesk
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Informasi Kontak</span>
                </CardTitle>
                <CardDescription>
                  Hubungi tim HR untuk bantuan dan informasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Phone className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Telepon</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">(021) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">hr@hcga.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <MapPin className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Alamat</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Jl. HR. Rasuna Said No. 123<br />
                      Jakarta Selatan 12940
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Jam Operasional</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Senin - Jumat: 08:00 - 17:00<br />
                      Sabtu: 08:00 - 12:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topik Bantuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Pengajuan Cuti & Training
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Bantuan untuk proses pengajuan cuti dan training
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-900 dark:text-green-200">
                      Data Karyawan
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Update data pribadi dan informasi karyawan
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                      Dokumen & SOP
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Akses dokumen perusahaan dan SOP
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                      Payroll & Benefit
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Informasi gaji dan benefit karyawan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription>
                  Isi form di bawah ini untuk mengirim pesan ke tim HR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input
                        id="nama"
                        value={formData.nama}
                        onChange={(e) => handleInputChange('nama', e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjek">Subjek</Label>
                    <Input
                      id="subjek"
                      value={formData.subjek}
                      onChange={(e) => handleInputChange('subjek', e.target.value)}
                      placeholder="Judul pesan Anda"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pesan">Pesan</Label>
                    <Textarea
                      id="pesan"
                      value={formData.pesan}
                      onChange={(e) => handleInputChange('pesan', e.target.value)}
                      placeholder="Jelaskan secara detail pertanyaan atau permintaan Anda..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Mengirim...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Kirim Pesan</span>
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Catatan:
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Pesan akan diproses dalam waktu 1x24 jam pada hari kerja</li>
                    <li>• Untuk keperluan mendesak, silakan hubungi nomor telepon HR</li>
                    <li>• Pastikan email yang Anda masukkan valid untuk menerima balasan</li>
                    <li>• Sertakan informasi yang detail agar kami dapat membantu lebih baik</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}