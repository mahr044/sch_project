import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SliderImage } from '@/lib/types'

export const SliderManager: React.FC = () => {
  const [sliders, setSliders] = useState<SliderImage[]>([])
  const [loading, setLoading] = useState(false)
  const [newSlider, setNewSlider] = useState({
    title: '',
    description: '',
    image_url: '',
    order: 0,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('slider_images')
        .select('*')
        .order('order', { ascending: true })

      if (error) throw error
      setSliders(data || [])
    } catch (error) {
      console.error('Error fetching sliders:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const supabase = createClient()
    const fileName = `${Date.now()}-${file.name}`

    const { error: uploadError, data } = await supabase.storage
      .from('slider-images')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('slider-images')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }

  const handleAddSlider = async () => {
    if (!newSlider.title || !imageFile) {
      alert('Please fill in title and select an image')
      return
    }

    setLoading(true)
    try {
      const imageUrl = await uploadImage(imageFile)

      const supabase = createClient()
      const { error } = await supabase.from('slider_images').insert({
        title: newSlider.title,
        description: newSlider.description,
        image_url: imageUrl,
        order: sliders.length,
      })

      if (error) throw error

      setNewSlider({ title: '', description: '', image_url: '', order: 0 })
      setImageFile(null)
      fetchSliders()
    } catch (error) {
      console.error('Error adding slider:', error)
      alert('Failed to add slider')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSlider = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('slider_images').delete().eq('id', id)

      if (error) throw error
      fetchSliders()
    } catch (error) {
      console.error('Error deleting slider:', error)
      alert('Failed to delete slider')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-right">إدارة السلايدر</h3>

      {/* Add New Slider */}
      <div className="mb-6 p-4 border border-gray-200 rounded bg-gray-50">
        <h4 className="font-semibold mb-3 text-right">إضافة سلايدر جديد</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="العنوان"
            value={newSlider.title}
            onChange={(e) => setNewSlider({ ...newSlider, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-right"
            dir="rtl"
          />
          <textarea
            placeholder="الوصف"
            value={newSlider.description}
            onChange={(e) => setNewSlider({ ...newSlider, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-right"
            dir="rtl"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddSlider}
            disabled={loading}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة'}
          </button>
        </div>
      </div>

      {/* Sliders List */}
      <div className="space-y-2">
        <h4 className="font-semibold text-right mb-3">السلايدرات الحالية</h4>
        {sliders.map((slider) => (
          <div key={slider.id} className="p-3 border border-gray-200 rounded flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-right">{slider.title}</p>
              <p className="text-sm text-gray-600 text-right">{slider.description}</p>
              {slider.image_url && (
                <img src={slider.image_url} alt={slider.title} className="w-20 h-20 mt-2 rounded" />
              )}
            </div>
            <button
              onClick={() => handleDeleteSlider(slider.id)}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
