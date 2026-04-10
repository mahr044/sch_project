import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { NewsItem } from '@/lib/types'

export const NewsManager: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    is_active: true,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('news_ticker')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNewsList(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

  const handleAddNews = async () => {
    if (!newNews.title || !newNews.content) {
      alert('يرجى ملء جميع الحقول')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('news_ticker').insert({
        title: newNews.title,
        content: newNews.content,
        is_active: newNews.is_active,
      })

      if (error) throw error

      setNewNews({ title: '', content: '', is_active: true })
      fetchNews()
    } catch (error) {
      console.error('Error adding news:', error)
      alert('فشل في إضافة الخبر')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNews = async (id: string, updates: Partial<NewsItem>) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('news_ticker')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      fetchNews()
      setEditingId(null)
    } catch (error) {
      console.error('Error updating news:', error)
      alert('فشل في تحديث الخبر')
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (!confirm('هل أنت متأكد?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('news_ticker').delete().eq('id', id)

      if (error) throw error
      fetchNews()
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('فشل في حذف الخبر')
    }
  }

  const handleToggleActive = (newsItem: NewsItem) => {
    handleUpdateNews(newsItem.id, { is_active: !newsItem.is_active })
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4 text-right">إدارة الأخبار المتحركة</h3>

      {/* Add New News */}
      <div className="mb-6 p-4 border border-gray-200 rounded bg-gray-50">
        <h4 className="font-semibold mb-3 text-right">إضافة خبر جديد</h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="العنوان"
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-right"
            dir="rtl"
          />
          <textarea
            placeholder="محتوى الخبر"
            value={newNews.content}
            onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded text-right"
            rows={4}
            dir="rtl"
          />
          <label className="flex items-center space-x-2 text-right">
            <input
              type="checkbox"
              checked={newNews.is_active}
              onChange={(e) => setNewNews({ ...newNews, is_active: e.target.checked })}
            />
            <span>نشط</span>
          </label>
          <button
            onClick={handleAddNews}
            disabled={loading}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة خبر'}
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-right mb-3">الأخبار الحالية</h4>
        {newsList.map((news) => (
          <div
            key={news.id}
            className={`p-4 border rounded ${news.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold text-right">{news.title}</p>
                <p className="text-sm text-gray-600 text-right mt-1">{news.content}</p>
                <p className="text-xs text-gray-500 text-right mt-2">
                  {new Date(news.created_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(news)}
                  className={`p-2 rounded text-sm ${
                    news.is_active ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {news.is_active ? 'إيقاف' : 'تفعيل'}
                </button>
                <button
                  onClick={() => handleDeleteNews(news.id)}
                  className="p-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
