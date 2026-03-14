import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface Props {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      setSelectedIndex(prev => {
        if (direction === 'next') return (prev + 1) % images.length;
        return (prev - 1 + images.length) % images.length;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') navigate('next');
      if (e.key === 'ArrowLeft') navigate('prev');
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, navigate]);

  const isPlaceholder = (src: string) => !src || src === '/placeholder';

  const renderImage = (src: string, index: number, className: string) => {
    if (isPlaceholder(src)) {
      return (
        <div className={cn('bg-[#F0ECE4] rounded-lg flex flex-col items-center justify-center text-[#4A4A4A]/40', className)}>
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          <span className="text-xs font-medium">Foto {index + 1}</span>
        </div>
      );
    }
    return (
      <img src={src} alt={`${productName} - Foto ${index + 1}`} className={cn('object-cover rounded-lg', className)} loading="lazy" />
    );
  };

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setLightboxOpen(true)}
          className="w-full cursor-pointer focus:outline-none"
          aria-label="Ampliar imagem"
        >
          {renderImage(images[selectedIndex], selectedIndex, 'w-full aspect-[4/3]')}
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  'rounded-lg overflow-hidden border-2 transition-colors focus:outline-none',
                  i === selectedIndex ? 'border-[#9CAF88]' : 'border-transparent hover:border-[#9CAF88]/50'
                )}
              >
                {renderImage(img, i, 'w-full aspect-square')}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); navigate('prev'); }}
                  className="absolute left-4 text-white/70 hover:text-white transition-colors"
                  aria-label="Anterior"
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); navigate('next'); }}
                  className="absolute right-4 text-white/70 hover:text-white transition-colors"
                  aria-label="Próximo"
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl max-h-[80vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              {renderImage(images[selectedIndex], selectedIndex, 'w-full max-h-[80vh] object-contain')}
            </motion.div>

            <div className="absolute bottom-4 text-white/50 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
