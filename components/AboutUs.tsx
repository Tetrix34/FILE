
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { optimizeCloudinaryUrl } from '../services/catalogService';
import { HouseIcon } from './icons/HouseIcon';
import { EyeIcon } from './icons/EyeIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

const valuesData = [
    {
        icon: <HouseIcon className="h-7 w-7 text-amber-600" />,
        title: "Misión",
        description: "Apoyar al trabajador guatemalteco en la creación de su hogar, con productos de calidad y opciones de crédito accesible. Creando espacios que inspiren y mejoren la vida de nuestros clientes donde cada familia encuentra un aliado para hogar."
    },
    {
        icon: <EyeIcon className="h-7 w-7 text-amber-600" />,
        title: "Visión",
        description: "Ser la empresa líder del mercado, ofreciendo productos de alta calidad, reconocida por su innovación, excelencia en el servicio y compromiso, creando espacios que inspiren y mejoren la vida de los guatemaltecos."
    },
    {
        icon: <SparklesIcon className="h-7 w-7 text-amber-600" />,
        title: "Nuestros Valores",
        description: "Honestidad, solidaridad, compromiso, responsabilidad y servicio. Permiten conectar de la mejor manera con nuestros clientes y así garantizar la fidelidad, confianza y seguridad de cada uno de ellos."
    }
];

const carouselImages = [
    {
        url: "https://res.cloudinary.com/dbc6tihw1/image/upload/v1766791779/IMG_2253_kjcnm8.jpg",
        alt: "Interior de la tienda La Casita"
    },
    {
        url: "https://res.cloudinary.com/dbc6tihw1/image/upload/v1766791778/IMG_2252_ljyed5.jpg",
        alt: "Exhibición de salas"
    },
    {
        url: "https://res.cloudinary.com/dbc6tihw1/image/upload/v1711876319/Gemini_Generated_Image_fijbj8fijbj8fijb_wdbefe.png",
        alt: "Detalle de acabados"
    },
    {
        url: "https://res.cloudinary.com/dbc6tihw1/image/upload/v1766791778/IMG_2254_sjtcjq.jpg",
        alt: "Vista general de tienda"
    }
];

export const AboutUs: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const startInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 3000);
    }, []);

    useEffect(() => {
        startInterval();
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [startInterval]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
        startInterval();
    }, [startInterval]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        startInterval();
    }, [startInterval]);

    return (
        <div className="animate-view-change">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-slate-900 font-playfair opacity-0 animate-slideUpFadeIn" style={{ animationDelay: '100ms' }}>
                        Nuestra <span className="text-amber-500">Historia</span>
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed opacity-0 animate-slideUpFadeIn" style={{ animationDelay: '250ms' }}>
                        Más que una mueblería, somos una familia dedicada a construir los espacios donde nacerán tus mejores recuerdos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch bg-white border-2 border-slate-200 p-8 rounded-3xl shadow-xl">
                    <div className="relative w-full h-80 md:h-auto rounded-2xl overflow-hidden shadow-lg opacity-0 animate-slideUpFadeIn group border border-slate-100" style={{ animationDelay: '400ms' }}>
                        {carouselImages.map((image, index) => (
                             <img 
                                key={index}
                                src={optimizeCloudinaryUrl(image.url, 'w_800,h_600,c_fill,g_auto,q_auto,f_auto')} 
                                alt={image.alt}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}
                         <button onClick={goToPrev} className="absolute top-1/2 left-2 -translate-y-1/2 bg-slate-900/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeftIcon className="h-6 w-6" /></button>
                         <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-slate-900/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRightIcon className="h-6 w-6" /></button>
                         <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {carouselImages.map((_, index) => (
                                <button key={index} onClick={() => { setCurrentIndex(index); startInterval(); }} className={`h-1.5 rounded-full transition-all ${index === currentIndex ? 'bg-amber-400 w-6' : 'bg-white/50 w-2'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-y-10">
                        {valuesData.map((value, index) => (
                            <div key={index} className="flex items-start gap-5 opacity-0 animate-slideUpFadeIn" style={{ animationDelay: `${550 + index * 150}ms` }}>
                                <div className="flex-shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm text-amber-600">
                                    {value.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 font-playfair mb-2">{value.title}</h3>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
