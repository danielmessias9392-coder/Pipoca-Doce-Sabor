import { useState } from 'react';
import { CalendarCheck, Check } from 'lucide-react';

interface CompleteCartSectionProps {
  onReserveClick: () => void;
}

interface ProductItem {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  description: string;
  details: string[];
  image: string;
  alt: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'pipoca',
    index: '01',
    name: 'Pipoca fresquinha',
    subtitle: 'Doce caramelizada e salgada na hora',
    description:
      'Estourada na hora em panela de vidro profissional, espalhando aquele aroma irresistível pela festa. Servimos a clássica pipoca doce crocante e a salgada amanteigada.',
    details: ['Milho especial selecionado', 'Caixinhas higiênicas individuais', 'Reposição contínua'],
    image: '/src/assets/images/produto_pipoca_fresquinha_1795016631742.jpg',
    alt: 'Caixas listradas com pipoca doce caramelizada e pipoca salgada fresquinha',
  },
  {
    id: 'churros',
    index: '02',
    name: 'Churros deliciosos',
    subtitle: 'Crocantes por fora, macios por dentro',
    description:
      'Fritos na hora, passados no açúcar com canela na medida certa e finalizados com recheio e cobertura cremosa de doce de leite ou chocolate.',
    details: ['Massa artesanal leve', 'Doce de leite e chocolate', 'Servidos em embalagens práticas'],
    image: '/src/assets/images/produto_churros_deliciosos_1795016632821.jpg',
    alt: 'Churros dourados com açúcar, canela, doce de leite e chocolate em copos kraft',
  },
  {
    id: 'batatas',
    index: '03',
    name: 'Batatas saborosas',
    subtitle: 'Sequinhas, douradas e sempre quentinhas',
    description:
      'Preparadas em lotes rápidos durante todo o evento para garantir máxima crocância, acompanhadas de sachês de ketchup, maionese e cheddar cremoso.',
    details: ['Fritura sequinha e crocante', 'Cones individuais práticos', 'Acompanhamentos inclusos'],
    image: '/src/assets/images/produto_batatas_saborosas_1795016633408.jpg',
    alt: 'Cones de batatas fritas douradas e crocantes com molho cheddar e ketchup',
  },
];

export function CompleteCartSection({ onReserveClick }: CompleteCartSectionProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const markFailed = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const includedBenefits = [
    'Barraquinha única completa com os 3 produtos inclusos',
    'Operadores treinados e uniformizados durante todo o evento',
    'Insumos frescos, descartáveis, guardanapos e molhos inclusos',
    'Montagem antecipada e desmontagem sem trabalho para o anfitrião',
  ];

  return (
    <section id="barraquinha" className="py-16 lg:py-24 bg-[#FAF5EE] border-y border-[#E8DCD0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12">
          <div className="lg:col-span-7">
            <p className="text-xs sm:text-sm font-semibold text-[#C8232C] tracking-wide mb-2">
              Nossa Barraquinha · Pacote Único Completo
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D160B] tracking-tight text-balance">
              Ao contratar a Pipoca Doce Sabor, você leva a experiência completa
            </h2>
          </div>

          <div className="lg:col-span-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD0]">
              <p className="font-display text-lg sm:text-xl font-bold text-[#2D160B] leading-snug text-balance">
                “Uma barraquinha completa, três delícias para deixar seu evento ainda mais especial!”
              </p>
              <p className="mt-2.5 text-sm text-[#5C3A28] leading-relaxed">
                Não trabalhamos com aluguel separado por item. Em uma única contratação, seus
                convidados aproveitam pipoca, churros e batatas juntos.
              </p>
            </div>
          </div>
        </div>

        <div id="cardapio" className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="flex flex-col bg-[#FFFDF9] rounded-2xl border border-[#E8DCD0] overflow-hidden"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F3E9DC] relative">
                {!failedImages[product.id] ? (
                  <img
                    src={product.image}
                    alt={product.alt}
                    referrerPolicy="no-referrer"
                    onError={() => markFailed(product.id)}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FFF8E7] to-[#F3E9DC]">
                    <span className="font-mono text-xs text-[#C8232C] font-semibold mb-1">
                      {product.index}
                    </span>
                    <p className="font-display text-xl font-bold text-[#2D160B]">{product.name}</p>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs font-medium text-[#7A4B31] mb-1.5">
                  <span className="font-mono text-[#C8232C] font-semibold mr-1.5 tabular-nums">
                    {product.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="ml-1.5">Incluso na barraquinha completa</span>
                </p>

                <h3 className="font-display text-2xl font-bold text-[#2D160B] mb-1">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-[#C8232C] mb-3">{product.subtitle}</p>
                <p className="text-sm text-[#5C3A28] leading-relaxed mb-5 flex-1">
                  {product.description}
                </p>

                <ul className="pt-4 border-t border-[#E8DCD0] space-y-2">
                  {product.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-center gap-2 text-xs sm:text-sm text-[#2D160B] font-medium"
                    >
                      <Check className="w-4 h-4 text-[#C8232C] shrink-0" aria-hidden="true" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-[#2D160B] text-[#FFFDF9] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-balance">
              Tudo isso reunido em uma única barraquinha para a sua festa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {includedBenefits.map((benefit) => (
                <p key={benefit} className="flex items-start gap-2 text-sm text-[#F3E9DC]">
                  <Check className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{benefit}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onReserveClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-[#2D160B] bg-[#FBBF24] hover:bg-[#F59E0B] rounded-xl transition-colors duration-150 min-h-[48px] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D160B]"
            >
              <CalendarCheck className="w-5 h-5" aria-hidden="true" />
              Reservar Barraquinha Completa
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
