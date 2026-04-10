import React from 'react'
import { useSliderImages, useNewsItems } from '../hooks/useSliderNews'

const Hero: React.FC = () => {
  const { images } = useSliderImages()
  const { news } = useNewsItems()
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0)

  React.useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images])

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">جاري تحميل السلايدر...</p>
        </div>
      </section>
    )
  }

  const currentImage = images[currentSlideIndex]

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Slider */}
      <div className="relative w-full h-96 md:h-screen overflow-hidden">
        {/* Main Image */}
        <img
          src={currentImage.image_url}
          alt={currentImage.title}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{currentImage.title}</h1>
            <p className="text-xl md:text-2xl">{currentImage.description}</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75 text-black p-3 rounded-full z-10"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75 text-black p-3 rounded-full z-10"
        >
          →
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlideIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* News Ticker */}
      {news.length > 0 && (
        <div className="bg-red-600 text-white py-4 overflow-hidden">
          <div className="flex items-center gap-4 px-4">
            <span className="font-bold text-lg whitespace-nowrap">أخبار العاجلة</span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll flex gap-8">
                {news.map((item, idx) => (
                  <span key={`${item.id}-${idx}`} className="whitespace-nowrap">
                    {item.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Hero
