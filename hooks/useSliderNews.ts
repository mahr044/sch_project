import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SliderImage, NewsItem } from '@/lib/types'

export const useSliderImages = () => {
  const [images, setImages] = useState<SliderImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('slider_images')
          .select('*')
          .order('order', { ascending: true })

        if (error) throw error
        setImages(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images')
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  return { images, loading, error }
}

export const useNewsItems = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('news_ticker')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setNews(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return { news, loading, error }
}
