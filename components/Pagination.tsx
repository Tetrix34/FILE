import React from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationItems = () => {
    const pageNumbers: (string | number)[] = [];
    const DOTS = '...';

    // Handle the case of 7 or fewer pages by showing all page numbers
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    // Always show the first page
    pageNumbers.push(1);

    // Logic for pages around the current page
    if (currentPage <= 4) { // Current page is near the beginning
      pageNumbers.push(2, 3, 4, 5);
      pageNumbers.push(DOTS);
    } else if (currentPage >= totalPages - 3) { // Current page is near the end
      pageNumbers.push(DOTS);
      pageNumbers.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
    } else { // Current page is in the middle
      pageNumbers.push(DOTS);
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      pageNumbers.push(DOTS);
    }
    
    // Always show the last page
    pageNumbers.push(totalPages);
    
    return pageNumbers;
  };

  const paginationItems = getPaginationItems();

  const buttonBaseClasses = 'flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1D37] focus:ring-amber-400';

  return (
    <nav aria-label="Paginación de productos">
      <ul className="flex items-center justify-center space-x-1 md:space-x-2">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${buttonBaseClasses} bg-white text-slate-600 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 shadow-sm`}
            aria-label="Página anterior"
          >
            <span className="sr-only">Anterior</span>
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </li>

        {paginationItems.map((item, index) => (
          <li key={index}>
            {typeof item === 'string' ? (
              <span className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 text-amber-200/50" aria-hidden="true">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(item)}
                className={`${buttonBaseClasses} ${
                  currentPage === item
                    ? 'bg-amber-400 text-[#0A1D37] shadow-md scale-110 border border-amber-300'
                    : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200 shadow-sm'
                }`}
                aria-current={currentPage === item ? 'page' : undefined}
                aria-label={`Ir a la página ${item}`}
              >
                {item}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${buttonBaseClasses} bg-white text-slate-600 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 shadow-sm`}
            aria-label="Página siguiente"
          >
            <span className="sr-only">Siguiente</span>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
};