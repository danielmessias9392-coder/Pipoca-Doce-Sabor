import { useState } from 'react';
import { CalendarCheck, Quote, Star } from 'lucide-react';

interface TestimonialsSectionProps {
  onReserveClick: () => void;
}

type TestimonialCategory = 'todos' | 'aniversarios' | 'casamentos' | 'corporativo';

interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  eventSummary: string;
  category: Exclude<TestimonialCategory, 'todos'>;
  rating: number;
  quote: string;
  outcome: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'fernanda-rocha',
    author: 'Fernanda Rocha',
    role: 'Aniversário infantil de 8 anos',
    eventSummary: '95 convidados · Plano de 4 horas',
    category: 'aniversarios',
    rating: 5,
    quote:
      'Eu estava preocupada com filas na hora do lanche das crianças, mas a equipe chegou uma hora antes, montou a barraquinha impecável e deu conta de todo mundo com muita simpatia. Ter pipoca, churros e batata frita no mesmo lugar foi o grande sucesso da festa.',
    outcome: 'Crianças e adultos repetiram os três itens sem demora no atendimento.',
  },
  {
    id: 'juliana-rafael',
    author: 'Juliana e Rafael Mendes',
    role: 'Recepção de casamento ao ar livre',
    eventSummary: '160 convidados · Plano de 5 horas',
    category: 'casamentos',
    rating: 5,
    quote:
      'Queríamos um lanche descontraído para servir durante a pista de dança na madrugada. A barraquinha combinou perfeitamente com a decoração e os churros quentinhos com doce de leite conquistaram até os convidados mais exigentes.',
    outcome: 'Mais de 300 porções servidas quentinhas durante a festa.',
  },
  {
    id: 'camila-nogueira',
    author: 'Camila Nogueira',
    role: 'Coordenação Pedagógica · Festa da Família Escolar',
    eventSummary: '240 participantes · Plano de 5 horas',
    category: 'corporativo',
    rating: 5,
    quote:
      'Em eventos escolares precisamos de higiene rigorosa e agilidade para atender pais e alunos ao mesmo tempo. A Pipoca Doce Sabor entregou tudo organizado, com operadores uniformizados e reposição constante do começo ao fim.',
    outcome: 'Zero interrupções no serviço mesmo nos horários de maior movimento.',
  },
  {
    id: 'marcelo-tavares',
    author: 'Marcelo Tavares',
    role: 'Gestor de Pessoas · Confraternização de Fim de Ano',
    eventSummary: '120 colaboradores · Plano de 4 horas',
    category: 'corporativo',
    rating: 5,
    quote:
      'Contratamos para a confraternização da empresa e não precisamos nos preocupar com absolutamente nada: só indicamos o ponto de energia e eles cuidaram de toda a estrutura. As batatas crocantes e a pipoca caramelizada foram os destaques da tarde.',
    outcome: 'Contratação única simplificou o orçamento e agradou toda a equipe.',
  },
  {
    id: 'patricia-alencar',
    author: 'Patrícia Alencar',
    role: 'Festa de 15 anos da filha',
    eventSummary: '130 convidados · Plano de 4 horas',
    category: 'casamentos',
    rating: 5,
    quote:
      'O aroma da pipoca estourando na hora já cria um clima alegre logo na entrada do salão. Todos elogiaram o capricho das embalagens, a limpeza do carrinho e o sabor dos churros recheados na hora.',
    outcome: 'Avaliação unânime dos familiares e convidados da festa.',
  },
  {
    id: 'rodrigo-bezerra',
    author: 'Rodrigo Bezerra',
    role: 'Aniversário em chácara com a família',
    eventSummary: '70 convidados · Plano de 3 horas',
    category: 'aniversarios',
    rating: 5,
    quote:
      'Como o evento era em uma chácara mais afastada, fiquei receoso quanto à pontualidade. Chegaram antes do combinado, montaram tudo rapidamente e atenderam nossos familiares com uma atenção fora do comum.',
    outcome: 'Festa tranquila para os anfitriões aproveitarem cada momento.',
  },
];

const FILTER_TABS: Array<{ id: TestimonialCategory; label: string }> = [
  { id: 'todos', label: 'Todos os eventos' },
  { id: 'aniversarios', label: 'Aniversários' },
  { id: 'casamentos', label: 'Casamentos e 15 Anos' },
  { id: 'corporativo', label: 'Escolas e Empresas' },
];

export function TestimonialsSection({ onReserveClick }: TestimonialsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<TestimonialCategory>('todos');

  const visibleTestimonials =
    activeFilter === 'todos'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((item) => item.category === activeFilter);

  return (
    <section
      id="depoimentos"
      className="py-16 lg:py-24 bg-[#FFFDF9] border-t border-[#E8DCD0]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold text-[#C8232C] tracking-wide mb-2">
              Depoimentos de Clientes · Confiança Comprovada
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D160B] tracking-tight text-balance">
              Quem já levou a barraquinha completa recomenda para o seu evento
            </h2>
            <p className="mt-3 text-base text-[#5C3A28] leading-relaxed">
              Veja relatos reais de anfitriões, escolas e empresas que contrataram a Pipoca Doce
              Sabor com pipoca, churros e batatas servidos na hora.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8E7] border border-[#F59E0B]/40 flex items-center gap-5 shrink-0">
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-bold text-[#2D160B] tabular-nums leading-none">
                4,9 / 5,0
              </p>
              <p className="text-xs text-[#7A4B31] mt-1 font-medium">Média de avaliação</p>
            </div>
            <div className="h-10 w-px bg-[#E8DCD0]" aria-hidden="true" />
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-bold text-[#C8232C] tabular-nums leading-none">
                +280
              </p>
              <p className="text-xs text-[#7A4B31] mt-1 font-medium">Eventos atendidos</p>
            </div>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Filtrar depoimentos por tipo de evento"
          className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#FAF5EE] border border-[#E8DCD0] mb-8"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] ${
                  isActive
                    ? 'bg-[#2D160B] text-white'
                    : 'text-[#5C3A28] hover:text-[#2D160B] hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTestimonials.map((item) => (
            <article
              key={item.id}
              className="p-6 rounded-2xl bg-[#FAF5EE] border border-[#E8DCD0] flex flex-col justify-between gap-5"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className="inline-flex items-center gap-1"
                    aria-label={`Avaliação ${item.rating} de 5 estrelas`}
                  >
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-1.5 font-mono text-xs font-semibold text-[#2D160B] tabular-nums">
                      5,0
                    </span>
                  </div>
                  <Quote className="w-5 h-5 text-[#D4BFA8] shrink-0" aria-hidden="true" />
                </div>

                <blockquote className="text-sm sm:text-[15px] text-[#2D160B] leading-relaxed">
                  “{item.quote}”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#E8DCD0] space-y-2">
                <p className="text-xs font-medium text-[#7A4B31]">{item.outcome}</p>
                <div>
                  <p className="font-display text-base font-bold text-[#2D160B]">{item.author}</p>
                  <p className="text-xs text-[#5C3A28]">
                    <span>{item.role}</span>
                    <span className="mx-1.5 text-[#D4BFA8]" aria-hidden="true">
                      ·
                    </span>
                    <span className="tabular-nums">{item.eventSummary}</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-[#E8DCD0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm sm:text-base text-[#5C3A28]">
            Quer proporcionar essa mesma experiência para os seus convidados? Verifique nossa agenda
            logo abaixo.
          </p>
          <button
            type="button"
            onClick={onReserveClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#C8232C] hover:bg-[#A61B23] rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] focus-visible:ring-offset-2"
          >
            <CalendarCheck className="w-4 h-4" aria-hidden="true" />
            Consultar datas disponíveis
          </button>
        </div>
      </div>
    </section>
  );
}
