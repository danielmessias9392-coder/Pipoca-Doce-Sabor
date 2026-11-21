interface BrandLogoProps {
  variant?: 'dark' | 'light';
}

export function BrandLogo({ variant = 'dark' }: BrandLogoProps) {
  const textColor = variant === 'light' ? 'text-[#FFFDF9]' : 'text-[#2D160B]';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <svg
        width="34"
        height="34"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Festive striped awning roof */}
        <path
          d="M5 13C5 9.68629 7.68629 7 11 7H25C28.3137 7 31 9.68629 31 13V15H5V13Z"
          fill="#C8232C"
        />
        <rect x="10" y="7" width="4" height="8" fill="#FBBF24" />
        <rect x="18" y="7" width="4" height="8" fill="#FFFDF9" />
        <rect x="26" y="7" width="3" height="8" fill="#FBBF24" />
        {/* Warm popcorn puffs */}
        <circle cx="13" cy="5.5" r="2.5" fill="#FBBF24" />
        <circle cx="18" cy="4.5" r="3" fill="#FDE68A" />
        <circle cx="23" cy="5.5" r="2.5" fill="#F59E0B" />
        {/* Cart body in espresso brown and cream */}
        <rect x="7" y="15" width="22" height="13" rx="2" fill="#4A2511" />
        <rect x="9" y="17" width="18" height="9" rx="1" fill="#FFFDF9" />
        <rect x="11" y="19" width="4" height="5" rx="0.5" fill="#C8232C" />
        <rect x="16" y="19" width="4" height="5" rx="0.5" fill="#F59E0B" />
        <rect x="21" y="19" width="4" height="5" rx="0.5" fill="#C8232C" />
        {/* Wheels */}
        <circle cx="12" cy="30" r="3" fill="#2D160B" stroke="#FBBF24" strokeWidth="1.5" />
        <circle cx="24" cy="30" r="3" fill="#2D160B" stroke="#FBBF24" strokeWidth="1.5" />
      </svg>
      <span className={`font-display text-lg sm:text-xl font-bold tracking-tight ${textColor}`}>
        Pipoca Doce Sabor
      </span>
    </span>
  );
}
