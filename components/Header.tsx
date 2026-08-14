
import React, { useState, useRef, useEffect } from 'react';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { FilterIcon } from './icons/FilterIcon';
import { DollarIcon } from './icons/DollarIcon';

interface HeaderProps {
    view: 'catalog' | 'about' | 'locations';
    onViewChange: (view: 'catalog' | 'about' | 'locations') => void;
    onCreditClick: () => void;
    onToggleFilters: () => void;
    areFiltersActive: boolean;
}

const socialLinks = {
    whatsapp: 'https://wa.link/5vygt5',
    instagram: 'https://www.instagram.com/lacasita_muebleria/profilecard/?igsh=MW92MGI5dGQwMTZpZQ==',
    facebook: 'https://www.facebook.com/lacasitamuebleria',
    tiktok: 'https://www.tiktok.com/@lacasitamuebleria?_t=8nif6vQBt02&_r=1',
};

const phoneNumber = '50237859447';

export const Header: React.FC<HeaderProps> = React.memo(({ view, onViewChange, onCreditClick, onToggleFilters, areFiltersActive }) => {
    const [isIdle, setIsIdle] = useState(false);
    const idleTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const IDLE_TIMEOUT = 5000;
        const resetIdleTimer = () => {
            setIsIdle(false);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = window.setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
        };
        const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        activityEvents.forEach(event => window.addEventListener(event, resetIdleTimer, { passive: true }));
        resetIdleTimer();
        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            activityEvents.forEach(event => window.removeEventListener(event, resetIdleTimer));
        };
    }, []);

    const navLinkBaseClasses = 'px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1D37] focus:ring-amber-400';

    const navLinkClasses = (buttonView: 'catalog' | 'about' | 'locations') => 
        `${navLinkBaseClasses} ${
            view === buttonView 
            ? 'bg-amber-400 text-[#0A1D37] shadow-md border border-amber-300' 
            : 'text-amber-100 hover:bg-white/10 hover:text-white'
        }`;
        
    const socialLinkBaseClasses = "p-1 rounded-full text-amber-300 transform transition-all duration-300 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1D37] focus:ring-amber-400";
    
    return (
        <header className="sticky top-0 bg-[#0A1D37] shadow-xl z-20 border-b border-[#051021]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-2 flex flex-wrap items-center justify-center sm:justify-between gap-y-3">
                    
                    <nav className="flex order-first sm:order-2 w-full sm:w-auto justify-center">
                        <div className="bg-white/5 p-1 rounded-xl flex items-center space-x-1 border border-white/10 shadow-inner">
                            <button onClick={() => onViewChange('about')} className={navLinkClasses('about')}>
                                Quiénes Somos
                            </button>
                            <button onClick={() => onViewChange('catalog')} className={navLinkClasses('catalog')}>
                                Catálogo
                            </button>
                            <button onClick={() => onViewChange('locations')} className={navLinkClasses('locations')}>
                                Ubicaciones
                            </button>
                        </div>
                    </nav>

                    <div className="w-full flex items-center justify-between sm:w-auto sm:order-1">
                        <a href="/" className={`flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1D37] focus:ring-amber-400 transition-transform duration-300 ${isIdle ? 'animate-idle-pulse' : ''}`} aria-label="Página de inicio de La Casita">
                            <img src="https://res.cloudinary.com/dbc6tihw1/image/upload/v1711609802/484572438_971815318422480_2820434675311835023_n_1_kl9pyl.jpg" alt="Logo La Casita" className="h-10 w-10 rounded-md object-cover ring-2 ring-amber-400/50" />
                            <div className="flex flex-col">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-playfair drop-shadow-md">
                                    <span className="text-amber-400">La</span> Casita
                                </h1>
                                 <span className="text-amber-200/60 text-[10px] font-bold tracking-[0.2em] uppercase -mt-1 text-center">
                                    Hogar & Muebles
                                </span>
                            </div>
                        </a>
                        <div className="flex items-center space-x-1 sm:hidden">
                            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={`${socialLinkBaseClasses} hover:text-green-400`} aria-label="WhatsApp">
                                <WhatsappIcon className="h-5 w-5"/>
                            </a>
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={`${socialLinkBaseClasses} hover:text-blue-500`} aria-label="Facebook">
                                <FacebookIcon className="h-5 w-5"/>
                            </a>
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={`${socialLinkBaseClasses} hover:text-pink-400`} aria-label="Instagram">
                                <InstagramIcon className="h-5 w-5"/>
                            </a>
                            <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className={`${socialLinkBaseClasses} hover:text-white`} aria-label="TikTok">
                                <TikTokIcon className="h-5 w-5"/>
                            </a>
                        </div>
                    </div>
                    
                    <div className="w-full flex justify-center items-center space-x-2 sm:space-x-3 sm:w-auto sm:order-3">
                         <button
                           onClick={onCreditClick}
                           className="flex items-center gap-2 bg-amber-500 text-[#0A1D37] font-bold py-1.5 px-3 rounded-lg shadow-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition-transform duration-200 ease-in-out animate-pulse-professional-glow border border-amber-400"
                         >
                           <DollarIcon className="h-5 w-5" />
                           <span className="text-sm">Crédito</span>
                         </button>
                        <a
                          href={`tel:+${phoneNumber}`}
                          className="flex items-center gap-2 bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-transform duration-200 ease-in-out border border-red-800"
                        >
                          <PhoneIcon className="h-5 w-5" />
                          <span className="text-sm">Llamar</span>
                        </a>
                        <div className="hidden sm:flex items-center space-x-2">
                            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={`${socialLinkBaseClasses} hover:text-green-400`} aria-label="WhatsApp">
                                <WhatsappIcon className="h-6 w-6"/>
                            </a>
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={`${socialLinkBaseClasses} hover:text-blue-500`} aria-label="Facebook">
                                <FacebookIcon className="h-6 w-6"/>
                            </a>
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={`${socialLinkBaseClasses} hover:text-pink-400`} aria-label="Instagram">
                                <InstagramIcon className="h-6 w-6"/>
                            </a>
                            <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className={`${socialLinkBaseClasses} hover:text-white`} aria-label="TikTok">
                                <TikTokIcon className="h-6 w-6"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {view === 'catalog' && (
                <div className="border-t border-[#051021] bg-[#051021] lg:hidden">
                    <div className="py-3 flex justify-center">
                        <button
                            onClick={onToggleFilters}
                            className="relative flex items-center gap-3 bg-amber-400 text-[#0A1D37] font-extrabold py-2 px-6 rounded-lg shadow-lg border border-amber-300 transition-all duration-300 ease-in-out hover:bg-amber-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <FilterIcon className="h-5 w-5 stroke-[2.5]" />
                            <span className="text-base">Ver Categorías de Artículos 🔎</span>
                            {areFiltersActive && <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-600 border-2 border-white animate-pulse"></span>}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
});
