import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import type { Category, Product } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { XIcon } from './icons/XIcon';
import { optimizeCloudinaryUrl } from '../services/catalogService';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface FilterSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  products: Product[];
  setSelectedProduct: (product: Product) => void;
  highlight: (text: string) => React.ReactNode;
  onViewChange: (view: 'catalog' | 'about' | 'locations') => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isMobileOpen,
  onMobileClose,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onResetFilters,
  products,
  setSelectedProduct,
  highlight,
  onViewChange,
}) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [autocompleteResults, setAutocompleteResults] = useState<Product[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null); // Using 'any' for browser-specific SpeechRecognition API

  // Flatten all subcategories into a single list for simpler rendering
  const allSubcategories = useMemo(() => 
    categories.flatMap(cat => cat.subcategories), 
    [categories]
  );

  useEffect(() => {
    if (isMobileOpen && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isMobileOpen]);

  // Autocomplete logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const results = products
        .filter(product =>
          product.name.toLowerCase().includes(lowercasedQuery) ||
          product.description.toLowerCase().includes(lowercasedQuery)
        )
        .slice(0, 7); // Limit results for performance and UI
      setAutocompleteResults(results);
      setIsAutocompleteOpen(results.length > 0);
    } else {
      setAutocompleteResults([]);
      setIsAutocompleteOpen(false);
    }
  }, [searchQuery, products]);

  // Click outside handler for autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup effect for speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const handleVoiceSearch = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Lo sentimos, tu navegador no soporta la búsqueda por voz. Por favor, intenta con Google Chrome.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'es-GT'; // Set language to Guatemalan Spanish
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSearchChange(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Error de reconocimiento de voz:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('El permiso para usar el micrófono fue denegado. Por favor, habilítalo en la configuración de tu navegador.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    
    recognition.start();

  }, [isListening, onSearchChange]);

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId);
    onMobileClose();
  };
  
  const handleAutocompleteSelect = (product: Product) => {
    onViewChange('catalog');
    setSelectedProduct(product);
    onSearchChange('');
    setIsAutocompleteOpen(false);
    onMobileClose();
  };

  const areFiltersActive = useMemo(() => selectedCategory !== 'all' || searchQuery !== '', [selectedCategory, searchQuery]);

  const renderFilters = () => (
    <div className="relative isolate bg-[#EAF4F7] h-full rounded-lg">
      {/* Search with Autocomplete */}
      <div ref={searchContainerRef} className="relative p-4 sm:p-6 border-b border-[#09829D]/25">
        <label htmlFor="search-input" className="block text-sm font-bold text-[#0A1D37] mb-2 font-playfair">
          Buscar Producto
        </label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#09829D] pointer-events-none" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsAutocompleteOpen(autocompleteResults.length > 0)}
            placeholder={isListening ? 'Escuchando ahora...' : 'Pulsa el micrófono...'}
            className={`w-full bg-white border-2 border-amber-400 rounded-lg py-2 pl-10 pr-20 text-[#0A1D37] focus:ring-[#09829D] focus:border-[#09829D] transition placeholder:text-gray-400 ${isListening ? 'animate-pulse-gold-glow' : ''}`}
            autoComplete="off"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button
              type="button"
              onClick={handleVoiceSearch}
              className="p-2 text-gray-400 rounded-full hover:bg-[#09829D]/10 hover:text-[#09829D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#09829D]"
              aria-label={isListening ? "Detener dictado" : "Buscar por voz"}
            >
              {isListening ? (
                <MicrophoneIcon className="h-5 w-5 text-red-500 animate-pulse" />
              ) : (
                <MicrophoneIcon className="h-5 w-5 text-[#09829D]" />
              )}
            </button>
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-2 text-gray-400 rounded-full hover:bg-[#09829D]/10 hover:text-[#09829D]"
                aria-label="Limpiar búsqueda"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        {/* Autocomplete Dropdown */}
        {isAutocompleteOpen && autocompleteResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 mx-4 sm:mx-6 bg-[#EAF4F7] border-2 border-amber-400 rounded-lg shadow-xl overflow-hidden animate-view-change">
            <ul className="max-h-80 overflow-y-auto divide-y divide-[#09829D]/20">
              {autocompleteResults.map(product => (
                <li key={product.id}>
                  <button
                    onClick={() => handleAutocompleteSelect(product)}
                    className="w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-[#09829D]/10 transition-colors duration-150"
                  >
                    <img
                      src={optimizeCloudinaryUrl(product.imageUrl, 'w_50,h_50,c_fill,q_auto,f_auto')}
                      alt={product.name}
                      className="w-12 h-12 object-contain rounded-md flex-shrink-0 bg-white p-1 border border-amber-300"
                    />
                    <div className="flex-grow overflow-hidden">
                      <p className="text-sm font-semibold text-[#0A1D37] truncate">
                        {highlight(product.name)}
                      </p>
                      <p className="text-xs text-[#1C2C42] truncate">
                        {product.category}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Simple Categories List */}
      <nav className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-[#0A1D37] font-playfair">Categorías de Artículos</h3>
            {areFiltersActive && (
                <button
                    onClick={onResetFilters}
                    className="text-xs font-medium text-[#09829D] hover:text-[#0A1D37] hover:underline transition-colors"
                >
                    Limpiar
                </button>
            )}
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-200 text-base border border-transparent ${
              selectedCategory === 'all'
                ? 'bg-amber-400 text-[#0A1D37] font-bold shadow-md border-amber-300'
                : 'text-[#1C2C42] hover:bg-[#09829D]/10 hover:border-[#09829D]/50 hover:text-[#0A1D37]'
            }`}
          >
            Todas las Categorías
          </button>
          
          {allSubcategories.map(subcategory => (
            <button
              key={subcategory.id}
              onClick={() => handleCategoryClick(subcategory.id)}
              className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-md text-sm transition-colors duration-150 border border-transparent ${
                selectedCategory === subcategory.id
                  ? 'text-[#0A1D37] font-semibold bg-amber-400 border-amber-300 shadow-sm'
                  : 'text-[#1C2C42] hover:bg-[#09829D]/10 hover:border-[#09829D]/50 hover:text-[#0A1D37]'
              }`}
            >
              {subcategory.icon && <span className="text-lg" aria-hidden="true">{subcategory.icon}</span>}
              <span>{subcategory.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );

  // Mobile view (off-canvas)
  const mobileSidebar = (
    <div
      className={`fixed inset-0 z-30 transition-opacity lg:hidden ${
        isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isMobileOpen}
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black/60" onClick={onMobileClose} aria-hidden="true"></div>
      <aside
        ref={sidebarRef}
        id="filter-sidebar"
        className={`fixed top-0 left-0 h-full w-72 bg-[#EAF4F7] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-r-4 border-amber-400 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-amber-500/30 flex-shrink-0 bg-[#0A1D37] text-white">
          <h2 className="text-lg font-bold font-playfair text-amber-300">Categorías de Artículos</h2>
          <button onClick={onMobileClose} className="text-white/80 hover:text-white" aria-label="Cerrar filtros">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto h-full">
          {renderFilters()}
        </div>
      </aside>
    </div>
  );

  // Desktop view (static sidebar)
  const desktopSidebar = (
    <div className="hidden lg:block lg:col-span-1">
      <aside className="sticky top-28 w-full max-h-[calc(100vh-8.5rem)] overflow-y-auto bg-[#EAF4F7] rounded-xl shadow-xl border-[3px] border-amber-400">
        {renderFilters()}
      </aside>
    </div>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
};