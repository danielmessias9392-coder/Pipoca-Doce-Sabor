import { Instagram, Mail, MessageCircle, MapPin } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from '../types/booking';

export function Footer() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Olá! Vim pelo site da Pipoca Doce Sabor e gostaria de informações.'
  )}`;

  return (
    <footer className="bg-[#2D160B] text-[#F3E9DC] border-t border-[#4A2511]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#4A2511]">
          <div className="md:col-span-5 space-y-4">
            <BrandLogo variant="light" />
            <p className="text-sm text-[#D4BFA8] leading-relaxed max-w-sm">
              Levamos sabor, diversão e alegria para o seu evento com uma barraquinha única e
              completa de pipoca fresquinha, churros deliciosos e batatas saborosas.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-display text-sm font-bold text-white">Navegação</p>
            <ul className="space-y-2 text-sm text-[#D4BFA8]">
              <li>
                <a href="#inicio" className="hover:text-[#FBBF24] transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#barraquinha" className="hover:text-[#FBBF24] transition-colors">
                  Nossa Barraquinha
                </a>
              </li>
              <li>
                <a href="#eventos" className="hover:text-[#FBBF24] transition-colors">
                  Eventos Atendidos
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-[#FBBF24] transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#instagram" className="hover:text-[#FBBF24] transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#agendamento" className="hover:text-[#FBBF24] transition-colors">
                  Reservar Minha Data
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <p className="font-display text-sm font-bold text-white">Contato</p>
            <ul className="space-y-2.5 text-sm text-[#D4BFA8]">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#FBBF24] transition-colors font-mono tabular-nums"
                >
                  <MessageCircle className="w-4 h-4 text-[#FBBF24] shrink-0" aria-hidden="true" />
                  <span>{WHATSAPP_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#FBBF24] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#FBBF24] shrink-0" aria-hidden="true" />
                  <span>{INSTAGRAM_HANDLE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 hover:text-[#FBBF24] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#FBBF24] shrink-0" aria-hidden="true" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FBBF24] shrink-0" aria-hidden="true" />
                <span>Atendimento em festas, escolas e empresas</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#B39E8C]">
          <p>© {new Date().getFullYear()} Pipoca Doce Sabor. Todos os direitos reservados.</p>
          <p>Barraquinha completa: Pipoca · Churros · Batatas</p>
        </div>
      </div>
    </footer>
  );
}
