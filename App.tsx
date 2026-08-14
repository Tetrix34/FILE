
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getCatalogData } from './services/catalogService';
import type { Product, Category } from './types';
import { FilterSidebar } from './components/FilterSidebar';

// Lazy load components that are not immediately visible
const AboutUs = lazy(() => import('./components/AboutUs').then(module => ({ default: module.AboutUs })));
const Locations = lazy(() => import('./components/Locations').then(module => ({ default: module.Locations })));
const ProductModal = lazy(() => import('./components/ProductModal').then(module => ({ default: module.ProductModal })));
const CreditModal = lazy(() => import('./components/CreditModal').then(module => ({ default: module.CreditModal })));
const Pagination = lazy(() => import('./components/Pagination').then(module => ({ default: module.Pagination })));

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<'catalog' | 'about' | 'locations'>('about');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);


  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { products, categories } = await getCatalogData();
        setProducts(products);
        setCategories(categories);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error inesperado.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect to handle deep linking via URL parameters
  useEffect(() => {
    if (!isLoading && products.length > 0 && !error) {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('product');
      
      if (productId) {
        const productFromUrl = products.find(p => p.id === parseInt(productId, 10));
        
        if (productFromUrl) {
          setSelectedProduct(productFromUrl);
          // Clean the URL to prevent the modal from reopening on every state change.
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }
    }
  }, [products, isLoading, error]);

  // Effect to scroll to top on view change for specific views
  useEffect(() => {
    if (view === 'about' || view === 'locations') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [view]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
  }, []);
  
  const areFiltersActive = useMemo(() => selectedCategory !== 'all' || searchQuery !== '', [selectedCategory, searchQuery]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      // Find the display name for the selected subcategory ID
      const subcategoryName = categories
        .flatMap(cat => cat.subcategories)
        .find(sub => sub.id === selectedCategory)?.name;

      if (subcategoryName) {
        filtered = filtered.filter(product => product.category === subcategoryName);
      }
    }

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(lowercasedQuery) ||
          product.description.toLowerCase().includes(lowercasedQuery) ||
          product.longDescription.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    return filtered;

  }, [products, selectedCategory, searchQuery, categories]);
  
  // This effect runs after filteredProducts has been recalculated, turning off the loading indicator.
  useEffect(() => {
    setIsFiltering(false);
  }, [filteredProducts]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    if (categoryId === selectedCategory) {
        return;
    }
    setIsFiltering(true);
    setTimeout(() => {
        setSelectedCategory(categoryId);
    }, 50);
  }, [selectedCategory]);



  // Memoize paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const highlightText = useCallback((text: string) => {
    if (!searchQuery.trim()) {
      return text;
    }
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b\\w*${escapedQuery}\\w*\\b`, 'gi');
    
    const matches = [...text.matchAll(regex)];
    if (matches.length === 0) {
      return text;
    }
    
    const result: (string | React.ReactNode)[] = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      const matchIndex = match.index!;
      const matchedText = match[0];
      
      if (matchIndex > lastIndex) {
        result.push(text.substring(lastIndex, matchIndex));
      }
      
      result.push(
        <mark key={i} className="bg-amber-300 text-slate-900 px-1 rounded shadow-sm font-semibold">
          {matchedText}
        </mark>
      );
      
      lastIndex = matchIndex + matchedText.length;
    });

    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return <>{result}</>;
  }, [searchQuery]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="text-center py-20 container mx-auto px-4 sm:px-6 lg:px-8 bg-slate-200 rounded-xl mt-8">
          <h2 className="text-2xl font-bold text-red-600">Error al Cargar</h2>
          <p className="text-red-800 mt-2">{error}</p>
        </div>
      );
    }
    
    if (view === 'about') {
      return <div className="container mx-auto px-4 sm:px-6 lg:px-8"><AboutUs /></div>;
    }

    if (view === 'locations') {
        return <div className="container mx-auto px-4 sm:px-6 lg:px-8"><Locations /></div>;
    }

    // Catalog view
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <FilterSidebar
            isMobileOpen={isFilterSidebarOpen}
            onMobileClose={() => setIsFilterSidebarOpen(false)}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetFilters={handleResetFilters}
            products={products}
            setSelectedProduct={setSelectedProduct}
            highlight={highlightText}
            onViewChange={setView}
          />
          
          <div className="lg:col-span-3 relative">
             {isFiltering && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" aria-label="Filtrando productos..."></div>
                </div>
              )}
            {paginatedProducts.length > 0 ? (
              <div
                key={`${selectedCategory}-${searchQuery}-${currentPage}`}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-slideUpFadeIn"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <ProductCard
                      product={product}
                      onCardClick={() => setSelectedProduct(product)}
                      highlight={highlightText}
                    />
                  </div>
                ))}
              </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-amber-200 p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-900 font-playfair">No se encontraron productos</h2>
                    {areFiltersActive ? (
                        <>
                            <p className="text-slate-500 mt-3 max-w-md mx-auto">
                                No pudimos encontrar resultados que coincidan con los filtros.
                            </p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-6 px-6 py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-lg border border-amber-400"
                            >
                                Limpiar Filtros
                            </button>
                        </>
                    ) : (
                        <p className="text-slate-500 mt-2">
                            Intenta cambiar los filtros o el término de búsqueda.
                        </p>
                    )}
                </div>
            )}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const isCenteredView = view === 'about';

  return (
    <div className={`bg-[#F4F8FA] text-slate-900 min-h-screen font-sans ${isCenteredView ? 'flex flex-col' : ''}`}>
      <Header
        view={view}
        onViewChange={setView}
        onCreditClick={() => setIsCreditModalOpen(true)}
        onToggleFilters={() => setIsFilterSidebarOpen(true)}
        areFiltersActive={areFiltersActive}
      />
      <main className={`py-8 ${isCenteredView ? 'flex-grow flex items-center' : ''}`}>
        <Suspense fallback={<LoadingSpinner />}>
          {renderContent()}
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          highlight={highlightText}
        />
        <CreditModal 
          isOpen={isCreditModalOpen} 
          onClose={() => setIsCreditModalOpen(false)} 
        />
      </Suspense>
    </div>
  );
};

export default App;
