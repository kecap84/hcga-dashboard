'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Settings, Palette, Type, Globe, Save, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface WebSettings {
  id: string
  key: string
  value: string
  updatedAt: string
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const defaultSettings = {
    siteTitle: 'HCGA 3S-GSM Dashboard',
    siteDescription: 'Sistem Manajemen Sumber Daya Manusia',
    footerText: '© 2024 HCGA 3S-GSM Dashboard - Developed by Yan Firdaus',
    primaryColor: '#1E3A8A',
    secondaryColor: '#6B7280',
    accentColor: '#3B82F6',
    fontFamily: 'Inter',
    contactEmail: 'hr@hcga.com',
    contactPhone: '(021) 1234-5678',
    contactAddress: 'Jl. HR. Rasuna Said No. 123, Jakarta Selatan 12940',
    welcomeMessage: 'Selamat Datang di HCGA Dashboard',
    welcomeDescription: 'Kelola kebutuhan HR Anda dengan mudah dan efisien',
    operatingHours: 'Senin - Jumat: 08:00 - 17:00, Sabtu: 08:00 - 12:00'
  }

  useEffect(() => {
    setMounted(true)
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        const settingsMap = data.reduce((acc: Record<string, string>, item: WebSettings) => {
          acc[item.key] = item.value
          return acc
        }, {})
        setSettings({ ...defaultSettings, ...settingsMap })
      } else {
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setSettings(defaultSettings)
    }
  }

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Berhasil!",
          description: "Pengaturan berhasil disimpan",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error!",
          description: error.error || "Gagal menyimpan pengaturan",
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

  const handlePreview = () => {
    // Apply settings to current page for preview
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor)
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor)
    document.documentElement.style.setProperty('--accent-color', settings.accentColor)
    
    toast({
      title: "Preview Diterapkan",
      description: "Perubahan ditampilkan di halaman ini. Refresh untuk melihat perubahan di seluruh situs.",
    })
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
              Admin Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pengaturan Website
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Kelola konten dan tampilan website HCGA Dashboard
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Umum</TabsTrigger>
            <TabsTrigger value="appearance">Tampilan</TabsTrigger>
            <TabsTrigger value="contact">Kontak</TabsTrigger>
            <TabsTrigger value="content">Konten</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Pengaturan Umum</span>
                </CardTitle>
                <CardDescription>
                  Konfigurasi informasi dasar website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteTitle">Judul Website</Label>
                    <Input
                      id="siteTitle"
                      value={settings.siteTitle}
                      onChange={(e) => handleSettingChange('siteTitle', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Deskripsi Website</Label>
                    <Input
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerText">Teks Footer</Label>
                  <Input
                    id="footerText"
                    value={settings.footerText}
                    onChange={(e) => handleSettingChange('footerText', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Kontak</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telepon Kontak</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Jam Operasional</Label>
                  <Input
                    id="operatingHours"
                    value={settings.operatingHours}
                    onChange={(e) => handleSettingChange('operatingHours', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Pengaturan Tampilan</span>
                </CardTitle>
                <CardDescription>
                  Sesuaikan warna dan tipografi website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Warna Primer</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                        placeholder="#1E3A8A"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Warna Sekunder</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                        placeholder="#6B7280"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Warna Aksen</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.accentColor}
                        onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    value={settings.fontFamily}
                    onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Preview Warna</h4>
                  <div className="flex space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg border-2 border-gray-200"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <div 
                      className="w-16 h-16 rounded-lg border-2 border-gray-200"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                    <div 
                      className="w-16 h-16 rounded-lg border-2 border-gray-200"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Informasi Kontak</span>
                </CardTitle>
                <CardDescription>
                  Kelola informasi kontak dan alamat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactAddress">Alamat Lengkap</Label>
                  <Textarea
                    id="contactAddress"
                    value={settings.contactAddress}
                    onChange={(e) => handleSettingChange('contactAddress', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Utama</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telepon Utama</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Jam Operasional</Label>
                  <Textarea
                    id="operatingHours"
                    value={settings.operatingHours}
                    onChange={(e) => handleSettingChange('operatingHours', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <span>Konten Halaman</span>
                </CardTitle>
                <CardDescription>
                  Kelola teks dan konten di halaman utama
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Pesan Selamat Datang</Label>
                  <Input
                    id="welcomeMessage"
                    value={settings.welcomeMessage}
                    onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeDescription">Deskripsi Selamat Datang</Label>
                  <Textarea
                    id="welcomeDescription"
                    value={settings.welcomeDescription}
                    onChange={(e) => handleSettingChange('welcomeDescription', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Meta Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerText">Teks Footer</Label>
                  <Input
                    id="footerText"
                    value={settings.footerText}
                    onChange={(e) => handleSettingChange('footerText', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Menyimpan...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Simpan Pengaturan</span>
              </div>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}