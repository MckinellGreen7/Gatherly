import React, { useState, useRef, useEffect } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import EventImage from './EventImage';
import { Link } from 'react-router-dom';

interface CarouselProps {
  slides: { image: string; altText: string; link?: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // Start at 0 to have the first slide in view
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Compute indices for current, previous, and next slides
  const getIndex = (index: number) => {
    const prevIndex = (index - 1 + slides.length) % slides.length;
    const nextIndex = (index + 1) % slides.length;
    return [prevIndex, index, nextIndex];
  };

  const [prevIndex, currentIndex, nextIndex] = getIndex(currentSlide);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.scrollWidth / slides.length;
      const targetPosition = slideWidth * (currentSlide + 1); // Offset by 1 to account for the extra slide at the start

      carouselRef.current.scrollTo({
        left: targetPosition,
        behavior: 'smooth',
      });
    }
  }, [currentSlide, slides.length]);

  return (
    <div className="relative flex mt-2 flex-col items-center justify-center">
      <div
        ref={carouselRef}
        className="carousel scrollbar-hide flex w-full snap-x snap-mandatory gap-4 overflow-x-scroll scroll-smooth"
      >
        {[prevIndex, currentIndex, nextIndex].map((index) => (
          <div
            key={index}
            className="relative aspect-[1/1] w-[85%] shrink-0 snap-start snap-always rounded-xl bg-gray-200 md:w-[calc(33.33%-(32px/3))]"
          >
            <EventImage image={slides[index].image} />
            {slides[index].link && (
              <Link to={`/user/event/${slides[index].link}`}>
              <div className="absolute bottom-4 text-white font-bold text-xl bg-yellow-500 px-4 py-2 rounded">
                BOOK NOW
              </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="pagination my-4 flex gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 ease-out duration-300 rounded-full ${index === currentSlide ? "bg-black" : "bg-gray-400"}`}
          ></span>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full"
      >
        <BiChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full"
      >
        <BiChevronRight size={24} />
      </button>
    </div>
  );
};

export default Carousel;
