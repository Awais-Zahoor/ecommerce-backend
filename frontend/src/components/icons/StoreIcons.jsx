const cn = (...c) => c.filter(Boolean).join(' ');

/** Consistent stroke icons for storefront UI (replaces emoji). */
export function IconTruck({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M14 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8h3l4 4v6h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconGift({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 7.5V21m9-9.75H3m18 0c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125m18 0v-1.5c0-.621-.504-1.125-1.125-1.125h-18C3.504 9.375 3 9.879 3 10.5v1.5m18 0H3m6.75-6.375a2.625 2.625 0 114.95 0M9.75 5.25h4.5c.621 0 1.125.504 1.125 1.125v.75H8.625v-.75c0-.621.504-1.125 1.125-1.125z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTag({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 10.5V6a2 2 0 012-2h4.5L21 12.5a2 2 0 010 2.83l-4.17 4.17a2 2 0 01-2.83 0L3 10.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconSparkles({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRocket({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.5.5v4.8m6.09 9.07a14.98 14.98 0 01-6.09 9.07M9.5 5.3v4.8m0-4.8A14.98 14.98 0 003.34 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconHeart({ className, filled = false }) {
  return (
    <svg 
      className={cn('shrink-0 transition-all duration-300', className)} 
      viewBox="0 0 24 24" 
      fill={filled ? "currentColor" : "none"} 
      xmlns="http://www.w3.org/2000/svg" 
      aria-hidden
    >
      <path 
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
        stroke="currentColor" 
        strokeWidth={filled ? "0" : "1.5"} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export function IconCheckCircle({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTrophy({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBolt({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M13 2L4 14h7l-1 8 10-12h-7l0-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconHandshake({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 14l-2 2-3-3 6-6 3 3M16 14l2 2 3-3-6-6-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12l2 2M8 10l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconReceipt({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 4h12v16l-3-2-3 2-3-2-3 2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeartEmptyState({ className }) {
  return (
    <svg className={cn('shrink-0', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.25" className="opacity-35" />
      <path d="M12 21s-6.716-4.35-9.33-8.5C.38 9.5 1.5 5 6 5c2.5 0 4 2 4 2s1.5-2 4-2c4.5 0 5.62 4.5 3.33 7.5C18.716 16.65 12 21 12 21z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}
