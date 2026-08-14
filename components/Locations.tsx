
import React from 'react';
import { MapPinIcon } from './icons/MapPinIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ClockIcon } from './icons/ClockIcon';

const locations = [
  {
    name: 'Santa María de Jesús',
    department: 'Sacatepéquez',
    address: 'Calle Principal, a un costado del parque',
    phone: '50237859447',
    hours: 'Todos los días de 9:00 am a 9:00 pm',
    linkUrl: 'https://maps.app.goo.gl/skVSk8rE6npKzFwt5?g_st=aw',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.968038933454!2d-90.74166292489495!3d14.557458085934989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x858913a072120093%3A0x1b79f8de95d5c07!2sLa%20Casita!5e0!3m2!1ses-419!2sgt'
  },
  {
    name: 'Ciudad Vieja',
    department: 'Sacatepéquez',
    address: '2da Avenida 3-45, Zona 1',
    phone: '50236625659',
    hours: 'Todos los días de 9:00 am a 7:00 pm',
    linkUrl: 'https://maps.app.goo.gl/MPQcN4c3H39s8QiP6',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15447.882194883015!2d-90.7797705703713!3d14.558356779313214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85891395b45a0833%3A0xf01e08132e0c909e!2sCiudad%20Vieja!5e0!3m2!1sen!2sgt!4v1719523097368!5m2!1sen!2sgt'
  },
  {
    name: 'San Miguel Dueñas',
    department: 'Sacatepéquez',
    address: 'Plaza Central, Local 5B',
    phone: '50230642207',
    hours: 'Todos los días de 9:00 am a 7:00 pm',
    linkUrl: 'https://www.google.com/maps/search/?api=1&query=14.521410,-90.800333',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3862.359627331455!2d-90.80291342489535!3d14.521410285955582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDMxJzE3LjEiTiA5MMKwNDgnMDEuMiJX!5e0!3m2!1ses!2sgt!4v1761405571920!5m2!1ses!2sgt'
  },
  {
    name: 'Jocotenango',
    department: 'Sacatepéquez',
    address: 'Cerca del parque de Jocotenango',
    phone: '50230182368',
    hours: 'Todos los días de 9:00 am a 7:00 pm',
    linkUrl: 'https://maps.app.goo.gl/bfDQzqq82HVZiaDd8',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15446.42597405234!2d-90.75135118715822!3d14.578768000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85891398871f7679%3A0xe543ef8ca5d76c12!2sJocotenango!5e0!3m2!1ses!2sgt!4v1716142345678!5m2!1ses!2sgt'
  }
];

export const Locations: React.FC = () => {
    
  const formatPhoneNumber = (phone: string) => {
    const number = phone.startsWith('502') ? phone.substring(3) : phone;
    if (number.length === 8) {
        return `${number.substring(0, 4)}-${number.substring(4)}`;
    }
    return number;
  };
    
  return (
    <div className="py-8 md:py-12 animate-view-change">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-playfair mb-4 drop-shadow-sm">
          Nuestras Ubicaciones
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">
          Visítanos en cualquiera de nuestras sucursales. ¡Estamos listos para atenderte!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {locations.map((location, index) => (
          <div 
            key={index} 
            className="bg-[#EAF4F7] border-[3px] border-amber-400 rounded-xl shadow-xl overflow-hidden flex flex-col group transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(238,185,28,0.3)] hover:-translate-y-2 opacity-0 animate-slideUpFadeIn"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Map Section */}
            <div className="relative w-full h-56 border-b border-amber-300">
                <iframe
                    className="absolute top-0 left-0 w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                    src={location.embedUrl}
                    loading="lazy"
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={-1}
                    title={`Mapa de ${location.name}`}
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="bg-[#0A1D37]/90 backdrop-blur-md p-4 rounded-lg border-2 border-amber-400 shadow-sm">
                      <h3 className="text-xl font-bold text-amber-100 font-playfair">{location.name}</h3>
                      <p className="text-sm text-amber-300 font-semibold flex items-center gap-1.5 mt-1">
                          <MapPinIcon className="h-4 w-4" />
                          {location.department}
                      </p>
                    </div>
                </div>
            </div>
            
            {/* Details Section */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="space-y-5 flex-grow">
                <div className="flex items-start gap-4 text-[#1C2C42]">
                  <div className="bg-[#EAF4F7] p-2 rounded-full mt-1 border-2 border-amber-400">
                    <ClockIcon className="h-6 w-6 text-[#09829D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1D37]">Horario de Atención</p>
                    <p className="text-sm">{location.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-[#1C2C42]">
                  <div className="bg-[#EAF4F7] p-2 rounded-full mt-1 border-2 border-amber-400">
                    <PhoneIcon className="h-6 w-6 text-[#09829D]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1D37]">Teléfono</p>
                    <a 
                      href={`tel:+${location.phone}`}
                      className="text-sm text-[#1C2C42] hover:text-[#09829D] hover:underline transition-colors"
                    >
                      {formatPhoneNumber(location.phone)}
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-6">
                  <a 
                    href={location.linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full flex items-center justify-center gap-2 bg-[#0A1D37] text-amber-400 font-bold py-3 px-5 rounded-lg hover:bg-[#0E2954] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105 border border-amber-400"
                  >
                    <MapPinIcon className="h-5 w-5" />
                    <span>Ver en mapa</span>
                  </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
