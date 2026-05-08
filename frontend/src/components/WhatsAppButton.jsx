import React from 'react'

const WhatsAppButton = () => {
  const phoneNumber = "923071443372"; // User's real number
  const message = "Hello Awais Mart! I'm interested in your luxury collection. Can you help me?";
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
        onClick={handleClick}
        className="fixed bottom-8 right-8 z-[100] group cursor-pointer animate-fade-in-up"
    >
        {/* Breathing Glow Effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity"></div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white dark:bg-gray-950 shadow-2xl rounded-xl border border-slate-100 dark:border-gray-800 scale-0 group-hover:scale-100 transition-all origin-right duration-300">
            <p className="whitespace-nowrap text-xs font-black text-slate-800 dark:text-gray-100 tracking-widest uppercase italic">Boutique Concierge</p>
        </div>

        {/* Main Button */}
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-active:scale-95 group-hover:rotate-12 border-4 border-white dark:border-gray-900">
            <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10 fill-white">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.171.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.941-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.006.332.009c.109.004.258-.041.405.314.159.385.541 1.32.588 1.414.048.094.08.203.016.332s-.096.223-.191.332c-.095.11-.198.245-.282.329-.096.095-.197.198-.085.39.112.193.497.819 1.066 1.325.733.652 1.347.854 1.54.95.193.096.305.08.419-.051.114-.131.487-.567.617-.761.13-.193.259-.161.437-.097s1.13.535 1.325.632c.194.097.324.145.372.227.048.082.048.473-.096.878z"/>
            </svg>
        </div>
    </div>
  )
}

export default WhatsAppButton
