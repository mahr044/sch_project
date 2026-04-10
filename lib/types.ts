// Types for slider and news data
export interface SliderImage {
  id: string
  title: string
  description: string
  image_url: string
  order: number
  created_at: string
  updated_at: string
}

export interface NewsItem {
  id: string
  title: string
  content: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  user_id: string
  username: string
  created_at: string
}
