
import React, { useState, MouseEvent, useMemo, KeyboardEvent } from 'react';
import type { Product } from '../types';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { optimizeCloudinaryUrl } from '../services/catalogService';
import { StoreIcon } from './icons/StoreIcon';

interface ProductCardProps {
  product: Product;
  onCardClick: () => void;
  highlight: (text: string) => React.ReactNode;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onCardClick, highlight }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const phoneNumber = '50237859447';

  // Memoized validation for the purchase action
  const { isPurchasable, validationMessage } = useMemo(() => {
    // A simple validation for the phone number format (digits only)
    if (!/^\d+$/.test(phoneNumber)) {
      return { isPurchasable: false, validationMessage: 'Número de contacto no válido.' };
    }
    // Ensure product name is available for the message
    if (!product?.name) {
      return { isPurchasable: false, validationMessage: 'Información del producto incompleta.' };
    }
    // Prevent purchase of out of stock items
    if (product.price === 0) {
      return { isPurchasable: false, validationMessage: 'Este producto está agotado.' };
    }
    return { isPurchasable: true, validationMessage: '' };
  }, [product]);

  const handleBuyClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isPurchasable) return; 
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setIsClicked(true);
    const message = `Hola, estoy interesado en comprar el producto: "${product.name}".`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardClick();
    }
  };
  
  const lowQualityImageUrl = useMemo(() => optimizeCloudinaryUrl(product.imageUrl, 'w_50,e_blur:1000,q_1,f_auto'), [product.imageUrl]);
  const highQualityImageUrl = useMemo(() => optimizeCloudinaryUrl(product.imageUrl, 'w_400,q_auto,f_auto'), [product.imageUrl]);

  const buttonBaseClasses = `flex items-center justify-center bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out border border-red-800`;
  const buttonDynamicClasses = isPurchasable
    ? `hover:bg-red-800 hover:scale-105 active:scale-95 ${isClicked ? 'scale-110 text-amber-400' : ''}`
    : 'opacity-40 cursor-not-allowed grayscale';

  const isOutOfStock = product.price === 0;
  const formattedPrice = isOutOfStock 
    ? <span className="text-lg font-bold text-amber-600 uppercase tracking-tight">Agotado</span>
    : <span className="text-2xl font-black text-red-700 tracking-tight font-playfair">{`Q${new Intl.NumberFormat('en-US').format(Math.floor(product.price))}`}</span>;

  return (
    <div 
      onClick={onCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${product.name}`}
      className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transform transition-all duration-300 ease-in-out hover:-translate-y-2 cursor-pointer border border-slate-200 hover:border-amber-400 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
    >
      <div className="relative overflow-hidden p-2 h-48 bg-white border-b border-slate-100">
        <img
          src={lowQualityImageUrl}
          alt={`Vista previa borrosa de ${product.name}`}
          aria-hidden="true"
          className={`absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-contain transition-opacity duration-500 ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src={highQualityImageUrl}
          alt={`Fotografía de ${product.name}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-contain transition-all duration-500 ease-in-out group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
             <div className="bg-amber-600 text-white text-[10px] font-black py-1 px-3 rounded-full shadow-lg transform -rotate-12 uppercase tracking-widest border border-amber-400">Sin Stock</div>
          </div>
        )}
        <div 
          className="absolute top-3 right-3 bg-amber-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-900 font-black shadow-md border border-amber-500/50"
          title={`Categoría: ${product.category}`}
        >
          {product.categoryIcon ? (
            <span role="img" aria-label="icono de categoría">{product.categoryIcon}</span>
          ) : (
            <StoreIcon className="h-4 w-4 text-slate-900 flex-shrink-0" />
          )}
          <span className="hidden sm:inline uppercase tracking-tight">{product.category}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
            <h3 className="text-lg font-bold text-slate-900 truncate mt-1 group-hover:text-amber-600 transition-colors font-playfair">{highlight(product.name)}</h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-snug opacity-90">{highlight(product.description)}</p>
        </div>
        
        <div className="mt-4 flex justify-between items-center gap-2">
          {formattedPrice}
          <button
            onClick={handleBuyClick}
            disabled={!isPurchasable}
            className={`${buttonBaseClasses} ${buttonDynamicClasses}`}
            aria-label={`Comprar ${product.name} en WhatsApp`}
            title={!isPurchasable ? validationMessage : 'Comprar en WhatsApp'}
          >
            <WhatsappIcon className="h-5 w-5 mr-1" />
            <span className="text-sm uppercase tracking-wider">{isOutOfStock ? 'No Disp.' : 'Comprar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});
