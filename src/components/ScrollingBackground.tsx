import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const backgroundImages = [
  'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Gold coins and money
  'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Luxury watch
  'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Modern skyscraper
  'https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Gold bars
  'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Luxury car
  'https://images.pexels.com/photos/2068975/pexels-photo-2068975.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Financial charts
  'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Diamond jewelry  
  'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', // Luxury yacht
];

export const ScrollingBackground: React.FC = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      const imagePromises = backgroundImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const handleScroll = () => {
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalHeight = document.body.scrollHeight - windowHeight;
      
      // Calculate which image should be displayed based on scroll progress
      const scrollProgress = scrollY / totalHeight;
      const imageIndex = Math.floor(scrollProgress * backgroundImages.length) % backgroundImages.length;
      
      // Only update if the image index has changed
      if (imageIndex !== currentImageIndex && !isTransitioning) {
        setIsTransitioning(true);
        setCurrentImageIndex(imageIndex);
        
        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [imagesLoaded, currentImageIndex, isTransitioning]);

  // Don't render scrolling background on mobile
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Loading overlay */}
      {!imagesLoaded && (
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-yellow-900 to-amber-900 flex items-center justify-center">
          <div className="text-yellow-100 text-center">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm">Loading experience...</p>
          </div>
        </div>
      )}
      
      {/* Background images */}
      {imagesLoaded && (
        <div className="fixed inset-0 -z-20">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};