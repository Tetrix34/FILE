import React, { useEffect, useRef } from 'react';
import { XIcon } from './icons/XIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { UsersIcon } from './icons/UsersIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const benefits = [
  "Pagos flexibles",
  "Crédito en menos de media hora",
  "Llévate tus productos favoritos hoy mismo"
];

const requirements = [
  { text: "DPI (Documento Personal de Identificación)", icon: <DocumentIcon className="h-6 w-6 text-amber-600" /> },
  { text: "NIT", icon: <DocumentIcon className="h-6 w-6 text-amber-600" /> },
  { text: "Recibo de luz", icon: <ReceiptIcon className="h-6 w-6 text-amber-600" /> },
  { text: "2 números de referencia personales", icon: <UsersIcon className="h-6 w-6 text-amber-600" /> },
  { text: "2 números de teléfono", icon: <PhoneIcon className="h-6 w-6 text-amber-600" /> }
];

export const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Effect to handle modal visibility and body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Effect for keyboard shortcuts (Escape key)
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Focus trapping effect
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

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
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            (lastElement as HTMLElement).focus();
            e.preventDefault();
          }
        } else { // Tab
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
  }, [isOpen]);

  const handleCreditRequestClick = () => {
    const phoneNumber = '50237859447';
    const message = 'Hola, me gustaría solicitar información sobre CrediCasita.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="credit-modal-title"
      aria-hidden={!isOpen}
      style={{ transitionDelay: isOpen ? '0s' : '300ms' }}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? 'bg-opacity-70' : 'bg-opacity-0'}`}
      />
      <div
        className={`bg-[#EAF4F7] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-y-auto transform transition-all duration-300 ease-in-out border-4 border-amber-400 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="sticky top-3 right-3 self-end mr-3 text-[#0A1D37] hover:bg-red-600 hover:text-white bg-white/50 p-1.5 rounded-full transition-colors duration-200 z-10 shadow-sm border border-amber-400"
          aria-label="Cerrar modal"
        >
          <XIcon className="h-6 w-6" />
        </button>
        
        <div className="flex flex-col md:flex-row">
            <div className="md:w-5/12 p-6 md:p-8 pt-0 md:pt-8 flex flex-col">
                <div className="flex-grow">
                    <div className="flex items-center gap-4">
                        <img 
                            src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1711609802/484572438_971815318422480_2820434675311835023_n_1_kl9pyl.jpg" 
                            alt="Logo La Casita" 
                            className="h-14 w-14 rounded-lg object-cover shadow-md border-2 border-amber-400"
                        />
                        <span className="bg-[#09829D] text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-[#00A89F]/40">
                            CrediCasita
                        </span>
                    </div>
                    <h2 id="credit-modal-title" className="text-3xl md:text-4xl font-bold text-[#0A1D37] mt-4 font-playfair">
                        Tu Hogar, a Tu Alcance
                    </h2>
                    <p className="text-[#1C2C42] mt-4 text-base leading-relaxed">
                        Con nuestro sistema de crédito 'CrediCasita', amueblar tu hogar es más fácil que nunca. Olvídate de los trámites complicados y empieza a disfrutar de la calidad y estilo que te mereces.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-amber-700 mt-6 mb-3">Beneficios</h3>
                    <ul className="space-y-2">
                        {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 text-[#1C2C42]">
                            <CheckCircleIcon className="h-5 w-5 text-[#09829D] mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="md:w-7/12 p-6 md:p-8 pt-0 md:pt-8 flex-shrink-0 bg-white/40 flex flex-col items-center justify-start border-l border-[#09829D]/20">
                <h3 className="text-2xl font-bold text-[#0A1D37] mb-4 font-playfair">Requisitos para Aplicar</h3>
                <div className="w-full max-w-md space-y-4">
                    {requirements.map((req, index) => (
                        <div key={index} className="bg-[#EAF4F7] p-4 rounded-lg flex items-center gap-4 border border-[#09829D]/20 shadow-sm">
                            <div className="flex-shrink-0">{req.icon}</div>
                            <p className="text-[#1C2C42]">{req.text}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 w-full max-w-md flex flex-col-reverse sm:flex-row gap-4">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto flex-1 bg-[#0A1D37]/10 text-[#0A1D37] font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-[#0A1D37]/20 focus:outline-none focus:ring-2 focus:ring-[#0A1D37] transition-all duration-200 ease-in-out border border-[#0A1D37]/20"
                        aria-label="Cerrar modal"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={handleCreditRequestClick}
                        className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 bg-[#D32F2F] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#B71C1C] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-opacity-75 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 border border-red-400"
                        aria-label="Solicitar crédito en WhatsApp"
                    >
                        <WhatsappIcon className="h-6 w-6" />
                        <span>¡Solicita tu Crédito Ahora!</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};