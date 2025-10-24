'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, FileText, ArrowLeft, Save, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface PengajuanCuti {
  id: string
  nama: string
  nik: string
  jabatan: string
  departemen: string
  site: string
  poh: string
  statusKaryawan: string
  noKtp: string
  noTelp: string
  jenisPengajuanCuti: string
  tanggalCuti: string
  tanggalMulaiCuti: string
  tanggalAkhirCuti: string
  ruteCuti?: string
  berangkatDari?: string
  tujuan?: string
  sisaCuti?: number
  sisaCutiTahunan?: number
  cutiPeriodikBerikutnya?: string
  status: string
  createdAt: string
}

export default function PengajuanCutiPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [riwayat, setRiwayat] = useState<PengajuanCuti[]>([])
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    jabatan: '',
    departemen: '',
    site: '',
    poh: '',
    statusKaryawan: '',
    noKtp: '',
    noTelp: '',
    jenisPengajuanCuti: '',
    tanggalCuti: '',
    tanggalMulaiCuti: '',
    tanggalAkhirCuti: '',
    ruteCuti: '',
    berangkatDari: '',
    tujuan: '',
    sisaCuti: '',
    sisaCutiTahunan: '',
    cutiPeriodikBerikutnya: ''
  })

  useEffect(() => {
    setMounted(true)
    fetchRiwayat()
  }, [])

  const fetchRiwayat = async () => {
    try {
      const response = await fetch('/api/pengajuan-cuti')
      if (response.ok) {
        const data = await response.json()
        setRiwayat(data)
      }
    } catch (error) {
      console.error('Error fetching riwayat:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/pengajuan-cuti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Pengajuan cuti berhasil dikirim",
        })
        
        // Reset form
        setFormData({
          nama: '',
          nik: '',
          jabatan: '',
          departemen: '',
          site: '',
          poh: '',
          statusKaryawan: '',
          noKtp: '',
          noTelp: '',
          jenisPengajuanCuti: '',
          tanggalCuti: '',
          tanggalMulaiCuti: '',
          tanggalAkhirCuti: '',
          ruteCuti: '',
          berangkatDari: '',
          tujuan: '',
          sisaCuti: '',
          sisaCutiTahunan: '',
          cutiPeriodikBerikutnya: ''
        })
        setFile(null)
        
        // Refresh riwayat
        fetchRiwayat()
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal mengirim pengajuan",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui'
      case 'rejected':
        return 'Ditolak'
      default:
        return 'Menunggu'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali</span>
            </Link>
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
              Pengajuan Cuti
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="form" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Form Pengajuan</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat Pengajuan</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Form Pengajuan Cuti</span>
                </CardTitle>
                <CardDescription>
                  Isi form di bawah ini untuk mengajukan cuti
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Data Pribadi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input
                        id="nama"
                        value={formData.nama}
                        onChange={(e) => handleInputChange('nama', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nik">NIK</Label>
                      <Input
                        id="nik"
                        value={formData.nik}
                        onChange={(e) => handleInputChange('nik', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jabatan">Jabatan</Label>
                      <Input
                        id="jabatan"
                        value={formData.jabatan}
                        onChange={(e) => handleInputChange('jabatan', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="departemen">Departemen</Label>
                      <Input
                        id="departemen"
                        value={formData.departemen}
                        onChange={(e) => handleInputChange('departemen', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="site">Site / Lokasi Kerja</Label>
                      <Input
                        id="site"
                        value={formData.site}
                        onChange={(e) => handleInputChange('site', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="poh">POH</Label>
                      <Input
                        id="poh"
                        value={formData.poh}
                        onChange={(e) => handleInputChange('poh', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="statusKaryawan">Status Karyawan</Label>
                      <Select value={formData.statusKaryawan} onValueChange={(value) => handleInputChange('statusKaryawan', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kontrak">Kontrak</SelectItem>
                          <SelectItem value="Tetap">Tetap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="noKtp">No KTP</Label>
                      <Input
                        id="noKtp"
                        value={formData.noKtp}
                        onChange={(e) => handleInputChange('noKtp', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="noTelp">No Telp (WhatsApp)</Label>
                      <Input
                        id="noTelp"
                        value={formData.noTelp}
                        onChange={(e) => handleInputChange('noTelp', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Detail Cuti */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detail Cuti</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jenisPengajuanCuti">Jenis Pengajuan Cuti</Label>
                        <Select value={formData.jenisPengajuanCuti} onValueChange={(value) => handleInputChange('jenisPengajuanCuti', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis cuti" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cuti Periodik">Cuti Periodik</SelectItem>
                            <SelectItem value="Cuti Tahunan">Cuti Tahunan</SelectItem>
                            <SelectItem value="Cuti Emergency">Cuti Emergency</SelectItem>
                            <SelectItem value="Dinas Luar">Dinas Luar</SelectItem>
                            <SelectItem value="Ijin PP">Ijin PP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tanggalCuti">Tanggal Cuti</Label>
                        <Input
                          id="tanggalCuti"
                          type="date"
                          value={formData.tanggalCuti}
                          onChange={(e) => handleInputChange('tanggalCuti', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tanggalMulaiCuti">Tanggal Mulai Cuti</Label>
                        <Input
                          id="tanggalMulaiCuti"
                          type="date"
                          value={formData.tanggalMulaiCuti}
                          onChange={(e) => handleInputChange('tanggalMulaiCuti', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tanggalAkhirCuti">Tanggal Akhir Cuti</Label>
                        <Input
                          id="tanggalAkhirCuti"
                          type="date"
                          value={formData.tanggalAkhirCuti}
                          onChange={(e) => handleInputChange('tanggalAkhirCuti', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="berangkatDari">Berangkat Dari</Label>
                        <Input
                          id="berangkatDari"
                          value={formData.berangkatDari}
                          onChange={(e) => handleInputChange('berangkatDari', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tujuan">Tujuan</Label>
                        <Input
                          id="tujuan"
                          value={formData.tujuan}
                          onChange={(e) => handleInputChange('tujuan', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ruteCuti">Rute Cuti</Label>
                      <Textarea
                        id="ruteCuti"
                        value={formData.ruteCuti}
                        onChange={(e) => handleInputChange('ruteCuti', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sisaCuti">Sisa Cuti</Label>
                        <Input
                          id="sisaCuti"
                          type="number"
                          value={formData.sisaCuti}
                          onChange={(e) => handleInputChange('sisaCuti', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sisaCutiTahunan">Sisa Cuti Tahunan</Label>
                        <Input
                          id="sisaCutiTahunan"
                          type="number"
                          value={formData.sisaCutiTahunan}
                          onChange={(e) => handleInputChange('sisaCutiTahunan', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cutiPeriodikBerikutnya">Cuti Periodik Berikutnya</Label>
                        <Input
                          id="cutiPeriodikBerikutnya"
                          type="date"
                          value={formData.cutiPeriodikBerikutnya}
                          onChange={(e) => handleInputChange('cutiPeriodikBerikutnya', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upload Dokumen */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dokumen Pendukung</h3>
                    <div className="space-y-2">
                      <Label htmlFor="dokumen">Upload Dokumen PDF</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="dokumen"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {file && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>{file.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Mengirim...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Submit Pengajuan Cuti</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="riwayat">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pengajuan Cuti</CardTitle>
                <CardDescription>
                  Daftar pengajuan cuti yang telah Anda buat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {riwayat.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Belum ada riwayat pengajuan cuti
                    </p>
                  ) : (
                    riwayat.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{item.nama}</h4>
                            <p className="text-sm text-gray-600">{item.jenisPengajuanCuti}</p>
                            <p className="text-sm text-gray-600">
                              {item.tanggalMulaiCuti} - {item.tanggalAkhirCuti}
                            </p>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                        </div>
                        {item.berangkatDari && item.tujuan && (
                          <p className="text-sm text-gray-600">
                            {item.berangkatDari} → {item.tujuan}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Diajukan: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}