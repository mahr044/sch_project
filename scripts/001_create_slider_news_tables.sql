-- Create slider_images table
CREATE TABLE IF NOT EXISTS slider_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'عام',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_ticker table
CREATE TABLE IF NOT EXISTS news_ticker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table for authentication
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE slider_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_ticker ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for slider_images (public read, authenticated write)
CREATE POLICY "Allow public read on slider_images" 
  ON slider_images FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated insert on slider_images" 
  ON slider_images FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on slider_images" 
  ON slider_images FOR UPDATE 
  USING (true);

CREATE POLICY "Allow authenticated delete on slider_images" 
  ON slider_images FOR DELETE 
  USING (true);

-- Create policies for news_ticker (public read, authenticated write)
CREATE POLICY "Allow public read on news_ticker" 
  ON news_ticker FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated insert on news_ticker" 
  ON news_ticker FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on news_ticker" 
  ON news_ticker FOR UPDATE 
  USING (true);

CREATE POLICY "Allow authenticated delete on news_ticker" 
  ON news_ticker FOR DELETE 
  USING (true);

-- Create policies for admins
CREATE POLICY "Allow public read on admins" 
  ON admins FOR SELECT 
  USING (true);

-- Create storage bucket for slider images
INSERT INTO storage.buckets (id, name, public)
VALUES ('slider-images', 'slider-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for public access
CREATE POLICY "Allow public read on slider-images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'slider-images');

CREATE POLICY "Allow authenticated upload on slider-images bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'slider-images');

CREATE POLICY "Allow authenticated delete on slider-images bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'slider-images');

-- Insert default slider images
INSERT INTO slider_images (image_url, title, category, display_order) VALUES
  ('/images/slider/slide1.jpg', 'بدء التحضير لمعرض التربية الفنية الابداعى', 'تعليم', 1),
  ('/images/slider/slide2.jpg', 'روح التعاون والعمل كفريق', 'تعليم', 2),
  ('/images/slider/slide3.jpg', 'يوم رياضي حافل بالنشاطات لجميع الطلاب', 'فعاليات', 3),
  ('/images/slider/slide4.jpg', 'دعم دائم ومستمر', 'تعليم', 4),
  ('/images/slider/slide5.jpg', 'تشجيع وفعاليات تواكب الاحداث', 'فعاليات', 5);

-- Insert default news ticker items
INSERT INTO news_ticker (content, display_order) VALUES
  ('زيارة فريق الجودة للمدرسة قريبا', 1),
  ('افتتاح معرض أهلاً مدارس بأرض المعارض الدولي للكتاب', 2),
  ('قرب بدء الامتحان الاول', 3),
  ('والاستعداد لتدشين موقع مدرسة الاحايوه شرق الاعدادية لخدمة الطالب والمعلم وولى', 4);
