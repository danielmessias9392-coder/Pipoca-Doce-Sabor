import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onReserveClick: () => void;
}

export function Navbar({ onReserveClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#barraquinha', label: 'A Barraquinha' },
    { href: '#cardapio', label: 'Três Delícias' },
    { href: '#eventos', label: 'Eventos' },
    { href: '#depoimentos', label: 'Depoimentos' },
    { href: '#agendamento', label: 'Agendar' },
  ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8DCD0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#inicio"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] rounded-md"
        >
          <BrandLogo variant="dark" />
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C3A28]"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#C8232C] border-b-2 border-transparent hover:border-[#C8232C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onReserveClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#C8232C] hover:bg-[#A61B23] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] focus-visible:ring-offset-2"
          >
            Reservar Data
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E8DCD0] text-[#2D160B] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8DCD0] bg-[#FFFDF9] px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="block py-2.5 px-3 rounded-lg text-base font-medium text-[#2D160B] hover:bg-[#FAF5EE] hover:text-[#C8232C] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onReserveClick();
            }}
            className="w-full mt-2 py-3 px-4 text-sm font-semibold text-white bg-[#C8232C] hover:bg-[#A61B23] rounded-lg transition-colors min-h-[44px] cursor-pointer"
          >
            Reservar Minha Data
          </button>
        </div>
      )}
    </header>
  );
}
