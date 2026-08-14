
import React, { useEffect, useState, MouseEvent, TouchEvent, WheelEvent, useRef, useCallback } from 'react';
import type { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { optimizeCloudinaryUrl } from '../services/catalogService';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  highlight: (text: string) => React.ReactNode;
}

// Icons for zoom controls
const ZoomInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
  </svg>
);

const ZoomOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
    </svg>
);

const ExpandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
    </svg>
);


export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, highlight }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const productToShow = useRef(product);

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false); 
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const initialPinchDistanceRef = useRef(0);
  const lastTapRef = useRef(0);

  const MAX_ZOOM = 4;
  const MIN_ZOOM = 1;
  const ZOOM_STEP = 0.5;
  const DOUBLE_TAP_ZOOM = 2.5;
  const DOUBLE_TAP_DELAY = 300; 

  if (product) {
    productToShow.current = product;
  }

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  
  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (product) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      resetZoom(); 
      setIsImageLoaded(false); 
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = 'unset';
        productToShow.current = null; 
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [product, resetZoom]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [handleClose]);
  
  useEffect(() => {
    if (!product || !isAnimating || !modalRef.current) return;

    const modalElement = modalRef.current;
    const focusableElements = Array.from(modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    (firstElement as HTMLElement).focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (focusableElements.length < 2) {
        if (e.key === 'Tab') e.preventDefault();
        return;
      }
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            (lastElement as HTMLElement).focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            (firstElement as HTMLElement).focus();
            e.preventDefault();
          }
        }
      }
    };

    modalElement.addEventListener('keydown', handleTabKey);
    return () => {
      modalElement.removeEventListener('keydown', handleTabKey);
    };
  }, [product, isAnimating]);

  const handleBuyClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const currentProduct = productToShow.current;
    if (!currentProduct || currentProduct.price === 0) return;

    const phoneNumber = '50237859447';
    const message = `Hola, estoy interesado en comprar el producto: "${currentProduct.name}".`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  
  const clampPosition = useCallback((pos: { x: number; y: number }, currentZoom: number) => {
    if (!imageContainerRef.current || currentZoom <= MIN_ZOOM) {
      return { x: 0, y: 0 };
    }
    const { clientWidth, clientHeight } = imageContainerRef.current;
    
    const imgElement = imageContainerRef.current.querySelector('img');
    if (!imgElement) return pos;

    const { naturalWidth, naturalHeight } = imgElement;
    const containerRatio = clientWidth / clientHeight;
    const imageRatio = naturalWidth / naturalHeight;
    
    let renderedWidth, renderedHeight;
    if (containerRatio > imageRatio) {
        renderedHeight = clientHeight;
        renderedWidth = clientHeight * imageRatio;
    } else {
        renderedWidth = clientWidth;
        renderedHeight = clientWidth / imageRatio;
    }

    const maxX = Math.max(0, (renderedWidth * currentZoom - clientWidth) / 2) / currentZoom;
    const minX = -maxX;
    const maxY = Math.max(0, (renderedHeight * currentZoom - clientHeight) / 2) / currentZoom;
    const minY = -maxY;

    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    };
  }, []);
  
  const setZoomAndPosition = useCallback((newZoom: number, newPosition: { x: number, y: number }) => {
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    const clampedPosition = clampPosition(newPosition, clampedZoom);
    setZoom(clampedZoom);
    setPosition(clampedPosition);
  }, [clampPosition]);

  const handleZoomChange = useCallback((delta: number, clientX?: number, clientY?: number) => {
    const newZoom = zoom + delta;
    
    let newPosition = position;
    if (clientX !== undefined && clientY !== undefined && imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left - rect.width / 2;
        const mouseY = clientY - rect.top - rect.height / 2;
        
        const pointX = (mouseX - position.x * zoom) / zoom;
        const pointY = (mouseY - position.y * zoom) / zoom;

        newPosition = {
            x: (mouseX - pointX * newZoom) / newZoom,
            y: (mouseY - pointY * newZoom) / newZoom,
        };
    }

    setZoomAndPosition(newZoom, newPosition);
  }, [zoom, position, setZoomAndPosition]);

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleZoomChange(e.deltaY * -0.005 * zoom, e.clientX, e.clientY);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsInteracting(true);
    startPosRef.current = { x: e.clientX - position.x * zoom, y: e.clientY - position.y * zoom };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isInteracting) return;
    e.preventDefault();
    const newPosition = { x: (e.clientX - startPosRef.current.x) / zoom, y: (e.clientY - startPosRef.current.y) / zoom };
    setPosition(clampPosition(newPosition, zoom));
  };

  const handleMouseUp = () => setIsInteracting(false);

  const handleDoubleTap = useCallback((e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    if (zoom > MIN_ZOOM) {
      resetZoom();
    } else {
      handleZoomChange(DOUBLE_TAP_ZOOM - zoom, touch.clientX, touch.clientY);
    }
  }, [zoom, resetZoom, handleZoomChange]);

  const getPinchData = (e: TouchEvent<HTMLDivElement>) => {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    const distance = Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2));
    const centerX = (t1.clientX + t2.clientX) / 2;
    const centerY = (t1.clientY + t2.clientY) / 2;
    return { distance, centerX, centerY };
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        handleDoubleTap(e);
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
        if (zoom > 1) {
          setIsInteracting(true);
          startPosRef.current = { x: e.touches[0].clientX - position.x * zoom, y: e.touches[0].clientY - position.y * zoom };
        }
      }
    } else if (e.touches.length === 2) {
      e.preventDefault();
      setIsInteracting(true);
      const { distance } = getPinchData(e);
      initialPinchDistanceRef.current = distance / zoom;
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isInteracting) return;
    if (e.touches.length === 1 && zoom > 1) {
      e.preventDefault();
      const newPosition = { x: (e.touches[0].clientX - startPosRef.current.x) / zoom, y: (e.touches[0].clientY - startPosRef.current.y) / zoom };
      setPosition(clampPosition(newPosition, zoom));
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const { distance, centerX, centerY } = getPinchData(e);
      const newZoom = distance / initialPinchDistanceRef.current;
      handleZoomChange(newZoom - zoom, centerX, centerY);
    }
  };

  const handleTouchEnd = () => setIsInteracting(false);


  if (!isAnimating && !product) {
    return null;
  }
  
  const currentProduct = productToShow.current;
  if (!currentProduct) {
    return null;
  }

  const isClosing = !product && isAnimating;
  const isZoomed = zoom > 1;
  const isOutOfStock = currentProduct.price === 0;

  const formattedPrice = isOutOfStock
    ? <span className="text-3xl md:text-4xl font-bold text-amber-600 uppercase tracking-tighter">Agotado</span>
    : <span className="text-4xl md:text-5xl font-black text-red-700 tracking-tight font-playfair">{`Q${new Intl.NumberFormat('en-US').format(Math.floor(currentProduct.price))}`}</span>;
  
  const cachedPlaceholderUrl = optimizeCloudinaryUrl(currentProduct.imageUrl, 'w_400,q_auto,f_auto');
  const highQualityImageUrl = optimizeCloudinaryUrl(currentProduct.imageUrl, 'w_800,q_auto:good,f_auto');

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      aria-hidden={!product}
    >
      <div
        className={`fixed inset-0 bg-black bg-opacity-80 ${isClosing ? 'animate-fadeOutModal' : 'animate-fadeInModal'}`}
      />
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden border-2 border-slate-200 ${isClosing ? 'animate-scaleDown' : 'animate-scaleUp'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-slate-400 hover:bg-slate-100 hover:text-slate-900 bg-white/80 p-2 rounded-full transition-all duration-200 z-20 border border-slate-200 shadow-sm"
          aria-label="Cerrar modal"
        >
          <XIcon className="h-6 w-6" />
        </button>

        <div 
          ref={imageContainerRef}
          className="h-72 md:h-auto md:w-1/2 p-4 flex-shrink-0 bg-white flex items-center justify-center relative overflow-hidden group/zoom border-b md:border-b-0 md:border-r border-slate-100"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          <div
            className="relative w-full h-full"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              cursor: isZoomed ? (isInteracting ? 'grabbing' : 'grab') : 'zoom-in',
              transition: isInteracting ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
              touchAction: 'none',
            }}
          >
            <img
              src={cachedPlaceholderUrl}
              alt={`Vista previa de ${currentProduct.name}`}
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`}
            />
            <img
              src={highQualityImageUrl}
              alt={`Imagen ampliada de ${currentProduct.name}`}
              onLoad={() => setIsImageLoaded(true)}
              loading="eager"
              // @ts-ignore
              fetchpriority="high"
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm p-1.5 rounded-lg opacity-0 group-hover/zoom:opacity-100 focus-within:opacity-100 transition-opacity duration-300 shadow-sm border border-slate-700">
             <button
                onClick={() => handleZoomChange(-ZOOM_STEP)}
                disabled={zoom <= MIN_ZOOM}
                className="p-2 text-amber-100 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Alejar imagen"
             >
                <ZoomOutIcon className="h-5 w-5" />
             </button>
             {isZoomed && (
                <button
                    onClick={resetZoom}
                    className="p-2 text-amber-100 rounded-md hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                    aria-label="Restablecer zoom"
                >
                    <ExpandIcon className="h-5 w-5" />
                </button>
             )}
             <button
                onClick={() => handleZoomChange(ZOOM_STEP)}
                disabled={zoom >= MAX_ZOOM}
                className="p-2 text-amber-100 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Acercar imagen"
             >
                <ZoomInIcon className="h-5 w-5" />
             </button>
          </div>
        </div>

        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto bg-white">
          <div className="flex-grow">
            <span className="bg-amber-400 text-slate-900 text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider border border-amber-500 shadow-sm">
              {currentProduct.category}
            </span>
            <h2 id="product-modal-title" className="text-2xl md:text-3xl font-bold text-slate-900 mt-4 font-playfair leading-tight">
              {highlight(currentProduct.name)}
            </h2>
            <p className="text-slate-600 mt-6 text-base leading-relaxed">
              {highlight(currentProduct.longDescription)}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            {formattedPrice}
            <button
              onClick={handleBuyClick}
              disabled={isOutOfStock}
              className={`w-full sm:w-auto flex items-center justify-center bg-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 border border-red-800 ${isOutOfStock ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
              aria-label={isOutOfStock ? 'Producto no disponible' : `Comprar ${currentProduct.name} en WhatsApp`}
            >
              <WhatsappIcon className="h-6 w-6 mr-3" />
              <span className="tracking-widest uppercase">{isOutOfStock ? 'No Disponible' : 'Comprar Ahora'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
