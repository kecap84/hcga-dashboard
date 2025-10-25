'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Calendar, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'
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
  dokumenPdf?: string
  status: string
  createdAt: string
  updatedAt?: string
}

export default function AdminPengajuanCutiPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pengajuanCuti, setPengajuanCuti] = useState<PengajuanCuti[]>([])
  const [filteredData, setFilteredData] = useState<PengajuanCuti[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departemenFilter, setDepartemenFilter] = useState('all')
  const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanCuti | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    fetchPengajuanCuti()
  }, [])

  useEffect(() => {
    filterData()
  }, [pengajuanCuti, searchTerm, statusFilter, departemenFilter])

  const fetchPengajuanCuti = async () => {
    try {
      const response = await fetch('/api/pengajuan-cuti')
      if (response.ok) {
        const data = await response.json()
        setPengajuanCuti(data)
      }
    } catch (error) {
      console.error('Error fetching pengajuan cuti:', error)
      toast({
        title: "Error!",
        description: "Gagal mengambil data pengajuan cuti",
        variant: "destructive",
      })
    }
  }

  const filterData = () => {
    let filtered = pengajuanCuti

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.departemen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisPengajuanCuti.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    if (departemenFilter !== 'all') {
      filtered = filtered.filter(item => item.departemen === departemenFilter)
    }

    setFilteredData(filtered)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/pengajuan-cuti/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: `Status berhasil diubah menjadi ${newStatus}`,
        })
        
        fetchPengajuanCuti()
        setIsStatusDialogOpen(false)
        setSelectedPengajuan(null)
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal mengubah status",
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

  const downloadDocument = async (pengajuan: PengajuanCuti) => {
    if (!pengajuan.dokumenPdf) {
      toast({
        title: "Info",
        description: "Tidak ada dokumen yang tersedia",
      })
      return
    }

    // Simulasi download (dalam production, ini akan download file yang sebenarnya)
    toast({
      title: "Download",
      description: `Mengunduh dokumen untuk ${pengajuan.nama}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu'
      case 'approved':
        return 'Disetujui'
      case 'rejected':
        return 'Ditolak'
      case 'in_progress':
        return 'Terlaksana'
      case 'completed':
        return 'Selesai'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'in_progress':
        return <RefreshCw className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getDepartemenList = () => {
    const departemen = [...new Set(pengajuanCuti.map(item => item.departemen).filter(Boolean))]
    return departemen
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali ke Admin</span>
            </Link>
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
              Admin - Pengajuan Cuti
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Manajemen Pengajuan Cuti</span>
                </CardTitle>
                <CardDescription>
                  Kelola semua pengajuan cuti karyawan
                </CardDescription>
              </div>
              <Button onClick={fetchPengajuanCuti} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Section */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari nama, NIK, jabatan, departemen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full lg:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="in_progress">Terlaksana</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full lg:w-48">
                <Select value={departemenFilter} onValueChange={setDepartemenFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Departemen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Departemen</SelectItem>
                    {getDepartemenList().map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {pengajuanCuti.length}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Menunggu</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {pengajuanCuti.filter(item => item.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Disetujui</p>
                      <p className="text-2xl font-bold text-green-600">
                        {pengajuanCuti.filter(item => item.status === 'approved').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Terlaksana</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {pengajuanCuti.filter(item => item.status === 'in_progress').length}
                      </p>
                    </div>
                    <RefreshCw className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Selesai</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {pengajuanCuti.filter(item => item.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Jenis Cuti</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dokumen</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Tidak ada data pengajuan cuti
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nama}</TableCell>
                        <TableCell>{item.nik}</TableCell>
                        <TableCell>{item.departemen}</TableCell>
                        <TableCell>{item.jenisPengajuanCuti}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{item.tanggalMulaiCuti}</div>
                            <div className="text-gray-500">s/d {item.tanggalAkhirCuti}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(item.status)}
                              <span>{getStatusText(item.status)}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.dokumenPdf ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadDocument(item)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-sm">Tidak ada</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPengajuan(item)
                                setIsDetailDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPengajuan(item)
                                setIsStatusDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pengajuan Cuti</DialogTitle>
              <DialogDescription>
                Informasi lengkap pengajuan cuti karyawan
              </DialogDescription>
            </DialogHeader>
            {selectedPengajuan && (
              <div className="space-y-6">
                {/* Data Pribadi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <p className="font-medium">{selectedPengajuan.nama}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>NIK</Label>
                    <p className="font-medium">{selectedPengajuan.nik}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Jabatan</Label>
                    <p className="font-medium">{selectedPengajuan.jabatan}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Departemen</Label>
                    <p className="font-medium">{selectedPengajuan.departemen}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Site / Lokasi Kerja</Label>
                    <p className="font-medium">{selectedPengajuan.site}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>POH</Label>
                    <p className="font-medium">{selectedPengajuan.poh}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Status Karyawan</Label>
                    <p className="font-medium">{selectedPengajuan.statusKaryawan}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>No KTP</Label>
                    <p className="font-medium">{selectedPengajuan.noKtp}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>No Telp</Label>
                    <p className="font-medium">{selectedPengajuan.noTelp}</p>
                  </div>
                </div>

                {/* Detail Cuti */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detail Cuti</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Jenis Pengajuan Cuti</Label>
                      <p className="font-medium">{selectedPengajuan.jenisPengajuanCuti}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Status Saat Ini</Label>
                      <Badge className={getStatusColor(selectedPengajuan.status)}>
                        {getStatusText(selectedPengajuan.status)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Mulai</Label>
                      <p className="font-medium">{selectedPengajuan.tanggalMulaiCuti}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Akhir</Label>
                      <p className="font-medium">{selectedPengajuan.tanggalAkhirCuti}</p>
                    </div>
                    {selectedPengajuan.berangkatDari && (
                      <div className="space-y-2">
                        <Label>Berangkat Dari</Label>
                        <p className="font-medium">{selectedPengajuan.berangkatDari}</p>
                      </div>
                    )}
                    {selectedPengajuan.tujuan && (
                      <div className="space-y-2">
                        <Label>Tujuan</Label>
                        <p className="font-medium">{selectedPengajuan.tujuan}</p>
                      </div>
                    )}
                    {selectedPengajuan.sisaCuti && (
                      <div className="space-y-2">
                        <Label>Sisa Cuti</Label>
                        <p className="font-medium">{selectedPengajuan.sisaCuti} hari</p>
                      </div>
                    )}
                  </div>
                  {selectedPengajuan.ruteCuti && (
                    <div className="space-y-2">
                      <Label>Rute Cuti</Label>
                      <p className="font-medium">{selectedPengajuan.ruteCuti}</p>
                    </div>
                  )}
                </div>

                {/* Dokumen */}
                {selectedPengajuan.dokumenPdf && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dokumen Pendukung</h3>
                    <Button onClick={() => downloadDocument(selectedPengajuan)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Dokumen PDF
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Status Pengajuan</DialogTitle>
              <DialogDescription>
                Ubah status pengajuan cuti untuk {selectedPengajuan?.nama}
              </DialogDescription>
            </DialogHeader>
            {selectedPengajuan && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status Saat Ini</Label>
                  <Badge className={getStatusColor(selectedPengajuan.status)}>
                    {getStatusText(selectedPengajuan.status)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Ubah Status Menjadi</Label>
                  <Select onValueChange={(value) => {
                    if (selectedPengajuan) {
                      updateStatus(selectedPengajuan.id, value)
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status baru" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="approved">Disetujui</SelectItem>
                      <SelectItem value="in_progress">Terlaksana</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}