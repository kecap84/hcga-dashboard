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
  Users, 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  X
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Karyawan {
  id: string
  name: string
  nik: string
  jabatan: string
  departemen: string
  site: string
  poh: string
  statusKaryawan: string
  noKtp: string
  noTelp: string
  email: string
  createdAt: string
}

export default function DataKaryawanPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [karyawan, setKaryawan] = useState<Karyawan[]>([])
  const [filteredKaryawan, setFilteredKaryawan] = useState<Karyawan[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [departemenFilter, setDepartemenFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    jabatan: '',
    departemen: '',
    site: '',
    poh: '',
    statusKaryawan: '',
    noKtp: '',
    noTelp: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    setMounted(true)
    fetchKaryawan()
  }, [])

  useEffect(() => {
    filterKaryawan()
  }, [karyawan, searchTerm, departemenFilter])

  const fetchKaryawan = async () => {
    try {
      const response = await fetch('/api/data-karyawan')
      if (response.ok) {
        const data = await response.json()
        setKaryawan(data)
      }
    } catch (error) {
      console.error('Error fetching karyawan:', error)
    }
  }

  const filterKaryawan = () => {
    let filtered = karyawan

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.departemen.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (departemenFilter !== 'all') {
      filtered = filtered.filter(item => item.departemen === departemenFilter)
    }

    setFilteredKaryawan(filtered)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddKaryawan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/data-karyawan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Data karyawan berhasil ditambahkan",
        })
        
        setFormData({
          name: '',
          nik: '',
          jabatan: '',
          departemen: '',
          site: '',
          poh: '',
          statusKaryawan: '',
          noKtp: '',
          noTelp: '',
          email: '',
          password: ''
        })
        setIsAddDialogOpen(false)
        fetchKaryawan()
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal menambahkan karyawan",
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

  const handleEditKaryawan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingKaryawan) return

    setLoading(true)

    try {
      const response = await fetch('/api/data-karyawan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingKaryawan.id,
          ...formData
        }),
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Data karyawan berhasil diperbarui",
        })
        
        setIsEditDialogOpen(false)
        setEditingKaryawan(null)
        fetchKaryawan()
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal memperbarui karyawan",
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

  const handleDeleteKaryawan = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/data-karyawan?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Data karyawan berhasil dihapus",
        })
        fetchKaryawan()
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal menghapus karyawan",
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

  const openEditDialog = (karyawan: Karyawan) => {
    setEditingKaryawan(karyawan)
    setFormData({
      name: karyawan.name,
      nik: karyawan.nik,
      jabatan: karyawan.jabatan,
      departemen: karyawan.departemen,
      site: karyawan.site,
      poh: karyawan.poh,
      statusKaryawan: karyawan.statusKaryawan,
      noKtp: karyawan.noKtp,
      noTelp: karyawan.noTelp,
      email: karyawan.email,
      password: ''
    })
    setIsEditDialogOpen(true)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Nama', 'NIK', 'Jabatan', 'Departemen', 'Site', 'POH', 'Status Karyawan', 'No KTP', 'No Telp', 'Email'],
      ...filteredKaryawan.map(item => [
        item.name,
        item.nik,
        item.jabatan,
        item.departemen,
        item.site,
        item.poh,
        item.statusKaryawan,
        item.noKtp,
        item.noTelp,
        item.email
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data_karyawan.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getDepartemenList = () => {
    const departemen = [...new Set(karyawan.map(item => item.departemen).filter(Boolean))]
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
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali</span>
            </Link>
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
              Data Karyawan
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
                  <Users className="h-5 w-5" />
                  <span>Data Karyawan</span>
                </CardTitle>
                <CardDescription>
                  Kelola data karyawan perusahaan
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Karyawan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Karyawan Baru</DialogTitle>
                      <DialogDescription>
                        Isi data karyawan baru di bawah ini
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddKaryawan} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Lengkap</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
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
                          <Label htmlFor="noTelp">No Telp</Label>
                          <Input
                            id="noTelp"
                            value={formData.noTelp}
                            onChange={(e) => handleInputChange('noTelp', e.target.value)}
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
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Menyimpan...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Save className="h-4 w-4" />
                              <span>Simpan</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari nama, NIK, jabatan, atau departemen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full sm:w-48">
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>POH</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>No Telp</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKaryawan.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Tidak ada data karyawan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredKaryawan.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.nik}</TableCell>
                        <TableCell>{item.jabatan}</TableCell>
                        <TableCell>{item.departemen}</TableCell>
                        <TableCell>{item.site}</TableCell>
                        <TableCell>{item.poh}</TableCell>
                        <TableCell>
                          <Badge variant={item.statusKaryawan === 'Tetap' ? 'default' : 'secondary'}>
                            {item.statusKaryawan}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.noTelp}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteKaryawan(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Data Karyawan</DialogTitle>
              <DialogDescription>
                Perbarui data karyawan di bawah ini
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditKaryawan} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nama Lengkap</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-nik">NIK</Label>
                  <Input
                    id="edit-nik"
                    value={formData.nik}
                    onChange={(e) => handleInputChange('nik', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-jabatan">Jabatan</Label>
                  <Input
                    id="edit-jabatan"
                    value={formData.jabatan}
                    onChange={(e) => handleInputChange('jabatan', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-departemen">Departemen</Label>
                  <Input
                    id="edit-departemen"
                    value={formData.departemen}
                    onChange={(e) => handleInputChange('departemen', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-site">Site / Lokasi Kerja</Label>
                  <Input
                    id="edit-site"
                    value={formData.site}
                    onChange={(e) => handleInputChange('site', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-poh">POH</Label>
                  <Input
                    id="edit-poh"
                    value={formData.poh}
                    onChange={(e) => handleInputChange('poh', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-statusKaryawan">Status Karyawan</Label>
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
                  <Label htmlFor="edit-noKtp">No KTP</Label>
                  <Input
                    id="edit-noKtp"
                    value={formData.noKtp}
                    onChange={(e) => handleInputChange('noKtp', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-noTelp">No Telp</Label>
                  <Input
                    id="edit-noTelp"
                    value={formData.noTelp}
                    onChange={(e) => handleInputChange('noTelp', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Memperbarui...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Perbarui</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}