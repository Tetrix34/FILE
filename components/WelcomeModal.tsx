import React, { useEffect, useState } from 'react';
import { XIcon } from './icons/XIcon';

interface WelcomeModalProps {
  onClose?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Small timeout to let the page load beautifully first, then fade in the modal.
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none animate-fadeInModal"
      role="dialog"
      aria-modal="true"
      aria-label="Mensaje de bienvenida"
    >
      {/* Dark backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Card container */}
      <div 
        className="relative max-w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-400 animate-scaleUp flex flex-col items-center justify-center bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button in top corner */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-20 bg-[#F47321] text-white hover:bg-[#E05D1A] active:scale-95 p-2 rounded-full transition-all duration-200 shadow-lg border-2 border-white hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Cerrar bienvenida"
        >
          <XIcon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[3]" />
        </button>

        {/* Content Image Wrapper */}
        <div className="relative max-w-full max-h-full flex items-center justify-center bg-transparent">
          <img 
            src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1783034404/ChatGPT_Image_2_jul_2026_05_19_50_p.m._ugq8es.png" 
            alt="La Casita - Catálogo" 
            className="max-w-full max-h-[80vh] md:max-h-[85vh] w-auto h-auto object-contain transition-transform duration-300 hover:scale-[1.01] block"
            referrerPolicy="no-referrer"
            onLoad={(e) => {
              // Ensure we display correctly
              (e.target as HTMLImageElement).classList.add('opacity-100');
            }}
          />
        </div>
      </div>
    </div>
  );
};
