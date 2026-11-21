import { useState } from 'react';
import { CalendarCheck, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types/booking';

interface HeroSectionProps {
  onReserveClick: () => void;
}

const HERO_IMAGE = '/src/assets/images/hero_barraquinha_eventos_1795016631151.jpg';

export function HeroSection({ onReserveClick }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Olá! Gostaria de solicitar um orçamento para a barraquinha completa da Pipoca Doce Sabor.'
  )}`;

  const highlights = [
    {
      index: '01',
      title: 'Estrutura Completa',
      desc: 'Barraquinha própria, iluminada e higienizada para o seu evento.',
    },
    {
      index: '02',
      title: 'Três Clássicos Inclusos',
      desc: 'Pipoca, churros e batatas juntos em uma única contratação.',
    },
    {
      index: '03',
      title: 'Equipe Uniformizada',
      desc: 'Operadores treinados e atenciosos do início ao fim da festa.',
    },
    {
      index: '04',
      title: 'Preparo na Hora',
      desc: 'Tudo servido quentinho, crocante e embalado com capricho.',
    },
  ];

  return (
    <section id="inicio" className="pt-8 pb-14 lg:pt-12 lg:pb-20 bg-[#FFFDF9]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-2">
            <p className="text-xs sm:text-sm font-medium text-[#7A4B31] tracking-wide mb-4">
              <span>Barraquinha Completa para Eventos</span>
              <span className="mx-2 text-[#D4BFA8]" aria-hidden="true">
                ·
              </span>
              <span>Pipoca, Churros e Batatas</span>
            </p>

            <h1 className="font-display text-[clamp(2.25rem,4vw,3.65rem)] font-extrabold leading-[1.08] tracking-tight text-[#2D160B] text-balance mb-5">
              Levamos sabor, diversão e alegria para o seu evento!
            </h1>

            <p className="text-base sm:text-lg text-[#5C3A28] leading-relaxed max-w-xl mb-8">
              A <strong className="font-semibold text-[#2D160B]">Pipoca Doce Sabor</strong> transforma
              sua festa com uma barraquinha completa e charmosa, levando pipoca fresquinha, churros
              deliciosos e batatas crocantes preparados na hora para encantar crianças e adultos.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onReserveClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#C8232C] hover:bg-[#A61B23] rounded-xl transition-all duration-150 shadow-sm hover:-translate-y-0.5 min-h-[48px] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] focus-visible:ring-offset-2"
              >
                <CalendarCheck className="w-5 h-5" aria-hidden="true" />
                RESERVAR MINHA DATA
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-[#2D160B] bg-[#FBBF24] hover:bg-[#F59E0B] rounded-xl transition-colors duration-150 min-h-[48px] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D160B] focus-visible:ring-offset-2"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Falar pelo WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex">
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#E8DCD0] bg-[#FAF5EE] min-h-[280px] sm:min-h-[360px] lg:min-h-[440px]">
              {!imgError ? (
                <img
                  src={HERO_IMAGE}
                  alt="Barraquinha completa da Pipoca Doce Sabor em festa ao ar livre com pipoca, churros e batatas"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full lg:h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#FFF8E7] via-[#FAF5EE] to-[#F5E6D3]">
                  <p className="font-display text-2xl font-bold text-[#2D160B] mb-2">
                    Pipoca Doce Sabor
                  </p>
                  <p className="text-sm text-[#5C3A28] max-w-xs">
                    Barraquinha completa para festas e eventos com pipoca, churros e batatas.
                  </p>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2D160B]/65 via-[#2D160B]/20 to-transparent"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs sm:text-sm text-white font-medium">
                <span>Atendimento completo no local do evento</span>
                <span className="font-mono tabular-nums">Pipoca · Churros · Batatas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8DCD0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <div key={item.index} className="space-y-1.5">
              <p className="font-display text-base font-bold text-[#2D160B]">
                <span className="font-mono text-sm text-[#C8232C] mr-1.5 tabular-nums">
                  {item.index}.
                </span>
                {item.title}
              </p>
              <p className="text-sm text-[#5C3A28] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
