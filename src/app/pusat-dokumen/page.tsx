'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  ArrowLeft, 
  Search, 
  Download, 
  Plus, 
  Upload,
  Folder,
  File,
  Trash2,
  Save,
  Eye
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Dokumen {
  id: string
  nama: string
  kategori: string
  subFolder?: string
  filePath: string
  createdAt: string
}

export default function PusatDokumenPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dokumen, setDokumen] = useState<Dokumen[]>([])
  const [filteredDokumen, setFilteredDokumen] = useState<Dokumen[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    subFolder: ''
  })

  useEffect(() => {
    setMounted(true)
    fetchDokumen()
  }, [])

  useEffect(() => {
    filterDokumen()
  }, [dokumen, searchTerm, kategoriFilter])

  const fetchDokumen = async () => {
    try {
      const response = await fetch('/api/dokumen')
      if (response.ok) {
        const data = await response.json()
        setDokumen(data)
      }
    } catch (error) {
      console.error('Error fetching dokumen:', error)
    }
  }

  const filterDokumen = () => {
    let filtered = dokumen

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.subFolder && item.subFolder.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (kategoriFilter !== 'all') {
      filtered = filtered.filter(item => item.kategori === kategoriFilter)
    }

    setFilteredDokumen(filtered)
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

  const handleUploadDokumen = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "Error!",
        description: "Pilih file terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('nama', formData.nama)
      uploadFormData.append('kategori', formData.kategori)
      uploadFormData.append('subFolder', formData.subFolder)

      const response = await fetch('/api/dokumen', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Dokumen berhasil diunggah",
        })
        
        setFormData({
          nama: '',
          kategori: '',
          subFolder: ''
        })
        setFile(null)
        setIsAddDialogOpen(false)
        fetchDokumen()
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal mengunggah dokumen",
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

  const handleDownloadDokumen = async (dokumen: Dokumen) => {
    try {
      const response = await fetch(`/api/dokumen/download?id=${dokumen.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = dokumen.nama
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        toast({
          title: "Error!",
          description: "Gagal mengunduh dokumen",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Terjadi kesalahan server",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDokumen = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/dokumen?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Dokumen berhasil dihapus",
        })
        fetchDokumen()
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal menghapus dokumen",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Terjadi kesalahan server",
        variant: "destructive",
      })
    }
  }

  const getKategoriList = () => {
    const kategori = [...new Set(dokumen.map(item => item.kategori).filter(Boolean))]
    return kategori
  }

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'SOP':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'IK':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Internal Memo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Template Form':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <FileText className="h-8 w-8 text-green-500" />
      case 'ppt':
      case 'pptx':
        return <FileText className="h-8 w-8 text-orange-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
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
              Pusat Dokumen Human Capital
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
                  <FileText className="h-5 w-5" />
                  <span>Pusat Dokumen</span>
                </CardTitle>
                <CardDescription>
                  Kelola dokumen SOP, IK, Internal Memo, dan Template Form
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Dokumen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Dokumen Baru</DialogTitle>
                    <DialogDescription>
                      Unggah dokumen baru ke pusat dokumen
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadDokumen} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Dokumen</Label>
                      <Input
                        id="nama"
                        value={formData.nama}
                        onChange={(e) => handleInputChange('nama', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="kategori">Kategori</Label>
                      <Select value={formData.kategori} onValueChange={(value) => handleInputChange('kategori', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOP">SOP</SelectItem>
                          <SelectItem value="IK">IK</SelectItem>
                          <SelectItem value="Internal Memo">Internal Memo</SelectItem>
                          <SelectItem value="Template Form">Template Form</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subFolder">Sub Folder (Opsional)</Label>
                      <Input
                        id="subFolder"
                        value={formData.subFolder}
                        onChange={(e) => handleInputChange('subFolder', e.target.value)}
                        placeholder="Contoh: 2024, HRD, Keuangan"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="file">Pilih File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Mengunggah...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Upload className="h-4 w-4" />
                            <span>Upload</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari nama dokumen atau kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {getKategoriList().map((kategori) => (
                      <SelectItem key={kategori} value={kategori}>
                        {kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDokumen.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada dokumen yang ditemukan</p>
                </div>
              ) : (
                filteredDokumen.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(item.nama)}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.nama}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Badge className={getKategoriColor(item.kategori)}>
                          {item.kategori}
                        </Badge>
                        
                        {item.subFolder && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Folder className="h-3 w-3" />
                            <span>{item.subFolder}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDokumen(item)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDokumen(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}