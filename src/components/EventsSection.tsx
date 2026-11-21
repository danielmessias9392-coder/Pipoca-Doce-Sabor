import { ArrowRight, Building2, Cake, GraduationCap, Heart, Users } from 'lucide-react';
import type { EventType } from '../types/booking';

interface EventsSectionProps {
  onSelectEventType: (eventType: EventType) => void;
}

interface EventCardData {
  index: string;
  eventType: EventType;
  title: string;
  description: string;
  highlight: string;
  icon: typeof Cake;
}

const EVENT_TYPES: EventCardData[] = [
  {
    index: '01',
    eventType: 'Aniversário / Festa Infantil',
    title: 'Aniversários e Festas Infantis',
    description:
      'O ponto favorito da criançada e dos pais. Pipoca doce, churros e batata frita servidos com agilidade e segurança durante toda a comemoração.',
    highlight: 'Atendimento em salões, casas e buffets',
    icon: Cake,
  },
  {
    index: '02',
    eventType: 'Casamento / 15 Anos',
    title: 'Casamentos e Festas de 15 Anos',
    description:
      'Visual elegante em madeira e iluminação acolhedora para surpreender os convidados na pista de dança com lanchinhos quentinhos na madrugada.',
    highlight: 'Estética charmosa para recepções',
    icon: Heart,
  },
  {
    index: '03',
    eventType: 'Evento Escolar',
    title: 'Eventos Escolares e Formaturas',
    description:
      'Festas juninas, dia das crianças, feiras culturais e colações de grau com produção contínua para atender turmas grandes sem filas longas.',
    highlight: 'Alta capacidade de atendimento',
    icon: GraduationCap,
  },
  {
    index: '04',
    eventType: 'Confraternização Corporativa',
    title: 'Confraternizações Corporativas',
    description:
      'Integração de equipes, datas comemorativas e eventos de fim de ano em empresas com praticidade total e equipe uniformizada.',
    highlight: 'Pontualidade e estrutura autônoma',
    icon: Building2,
  },
  {
    index: '05',
    eventType: 'Evento Comunitário / Feira',
    title: 'Eventos Comunitários e Igrejas',
    description:
      'Encontros de famílias, ações em condomínios, batizados e festivais locais com alegria garantida do primeiro ao último convidado.',
    highlight: 'Instalação rápida em áreas internas ou externas',
    icon: Users,
  },
];

export function EventsSection({ onSelectEventType }: EventsSectionProps) {
  return (
    <section id="eventos" className="py-16 lg:py-24 bg-[#FFFDF9]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs sm:text-sm font-semibold text-[#C8232C] tracking-wide mb-2">
            Eventos Atendidos
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D160B] tracking-tight text-balance mb-4">
            Onde tem celebração, a Pipoca Doce Sabor chega pronta para servir
          </h2>
          <p className="text-base text-[#5C3A28] leading-relaxed">
            Clique no tipo de evento que você está organizando para pré-selecionar no calendário de
            agendamento abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENT_TYPES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.index}
                type="button"
                onClick={() => onSelectEventType(item.eventType)}
                className="group text-left p-6 rounded-2xl bg-[#FAF5EE] hover:bg-[#FFF8E7] border border-[#E8DCD0] hover:border-[#C8232C]/50 transition-all duration-150 flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-[#C8232C] tabular-nums">
                      {item.index}
                    </span>
                    <Icon
                      className="w-5 h-5 text-[#7A4B31] group-hover:text-[#C8232C] transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#2D160B] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5C3A28] leading-relaxed mb-4">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-[#E8DCD0] flex items-center justify-between gap-2 text-xs font-semibold text-[#7A4B31] group-hover:text-[#C8232C]">
                  <span>{item.highlight}</span>
                  <ArrowRight
                    className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}

          <div className="p-6 rounded-2xl bg-[#FFF8E7] border border-[#F59E0B]/40 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs font-semibold text-[#7A4B31] mb-4">
                Garantia Operacional
              </p>
              <h3 className="font-display text-xl font-bold text-[#2D160B] mb-3">
                Logística simples no seu espaço
              </h3>
              <ul className="space-y-2.5 text-sm text-[#5C3A28]">
                <li>· Chegada com 1 hora de antecedência para montagem</li>
                <li>· Necessita apenas de um ponto de energia padrão</li>
                <li>· Equipe uniformizada e normas rígidas de higiene</li>
                <li>· Atendimento flexível de 3h, 4h ou 5h de evento</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E8DCD0] mt-6">
              <button
                type="button"
                onClick={() => onSelectEventType('Outro Evento')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#C8232C] hover:text-[#A61B23] cursor-pointer"
              >
                <span>Agendar outro formato de evento</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
