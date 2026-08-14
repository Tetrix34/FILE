
import React from 'react';

export const Footer: React.FC = React.memo(() => {
    // Usamos versiones más estables y directas para evitar problemas de carga
    const visaLogo = "https://res.cloudinary.com/dbc6tihw1/image/upload/v1771549909/dfd_uwi94k.png";
    const mastercardLogo = "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg";
    
    return (
        <footer className="bg-[#051021] mt-12 py-10 border-t border-[#09829D]/25 shadow-inner">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
                <p className="font-semibold text-lg font-playfair text-amber-200/80">&copy; {new Date().getFullYear()} LA CASITA. Todos los derechos reservados.</p>
                <div className="mt-6 flex flex-col items-center">
                    <p className="text-xs mb-3 opacity-90 font-medium text-slate-500 uppercase tracking-widest">Aceptamos tarjetas de crédito y visacuotas</p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="bg-white px-3 py-1 rounded shadow-sm h-8 flex items-center border border-amber-400/20">
                             <img src={visaLogo} alt="Visa" className="h-full w-auto object-contain" loading="lazy" />
                        </div>
                        <div className="bg-white px-3 py-1 rounded shadow-sm h-8 flex items-center border border-amber-400/20">
                            <img src={mastercardLogo} alt="Mastercard" className="h-full w-auto object-contain" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
});