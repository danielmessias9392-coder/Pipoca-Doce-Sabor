import { useState } from 'react';
import { ArrowUpRight, Instagram, X } from 'lucide-react';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../types/booking';

interface InstagramPost {
  id: string;
  image: string;
  alt: string;
  caption: string;
  category: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'post-barraquinha',
    image: '/src/assets/images/hero_barraquinha_eventos_1795016631151.jpg',
    alt: 'Barraquinha completa da Pipoca Doce Sabor montada em festa ao ar livre',
    caption:
      'Estrutura completa montada antes da chegada dos convidados: pipoca, churros e batatas preparados na hora.',
    category: 'Bastidores · Montagem',
  },
  {
    id: 'post-pipoca',
    image: '/src/assets/images/produto_pipoca_fresquinha_1795016631742.jpg',
    alt: 'Pipoca doce caramelizada e pipoca salgada fresquinha da Pipoca Doce Sabor',
    caption:
      'Cheiro de pipoca fresquinha estourando na panela para deixar aniversários e eventos escolares ainda mais alegres.',
    category: 'Pipoca Fresquinha',
  },
  {
    id: 'post-churros',
    image: '/src/assets/images/produto_churros_deliciosos_1795016632821.jpg',
    alt: 'Churros crocantes com doce de leite e chocolate servidos no evento',
    caption:
      'Churros quentinhos passados no açúcar com canela e bastante doce de leite ou chocolate.',
    category: 'Churros Deliciosos',
  },
  {
    id: 'post-batatas',
    image: '/src/assets/images/produto_batatas_saborosas_1795016633408.jpg',
    alt: 'Cones de batatas fritas douradas e crocantes com molho cheddar',
    caption:
      'Batatinha sequinha e crocante servida em cones práticos durante toda a festa.',
    category: 'Batatas Saborosas',
  },
];

export function InstagramSection() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [activePost, setActivePost] = useState<InstagramPost | null>(null);

  const markFailed = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="instagram" className="py-16 lg:py-24 bg-[#FFFDF9] border-t border-[#E8DCD0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold text-[#C8232C] tracking-wide mb-2">
              Instagram Oficial · {INSTAGRAM_HANDLE}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D160B] tracking-tight text-balance">
              Acompanhe nossas festas e bastidores no Instagram
            </h2>
            <p className="mt-3 text-base text-[#5C3A28] leading-relaxed">
              Veja fotos reais da barraquinha montada nos eventos, preparos na hora e novidades da{' '}
              <strong className="font-semibold text-[#2D160B]">Pipoca Doce Sabor</strong>.
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-[#2D160B] hover:bg-[#4A2511] rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[48px] self-start md:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C] focus-visible:ring-offset-2"
          >
            <Instagram className="w-5 h-5 text-[#FBBF24]" aria-hidden="true" />
            <span>Seguir {INSTAGRAM_HANDLE}</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INSTAGRAM_POSTS.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setActivePost(post)}
              className="group relative aspect-square w-full rounded-2xl overflow-hidden border border-[#E8DCD0] bg-[#FAF5EE] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8232C]"
              aria-label={`Ver publicação do Instagram: ${post.category}`}
            >
              {!failedImages[post.id] ? (
                <img
                  src={post.image}
                  alt={post.alt}
                  referrerPolicy="no-referrer"
                  onError={() => markFailed(post.id)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-[#FFF8E7] to-[#F3E9DC]">
                  <Instagram className="w-6 h-6 text-[#C8232C] mb-2" aria-hidden="true" />
                  <p className="font-display text-base font-bold text-[#2D160B]">{post.category}</p>
                </div>
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#2D160B]/85 via-[#2D160B]/35 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[11px] font-mono text-[#FBBF24] mb-1">{post.category}</p>
                <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 text-[#FFFDF9]">
                  {post.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#FAF5EE] border border-[#E8DCD0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#C8232C] text-white flex items-center justify-center shrink-0">
              <Instagram className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-base sm:text-lg font-bold text-[#2D160B]">
                {INSTAGRAM_HANDLE}
              </p>
              <p className="text-xs sm:text-sm text-[#5C3A28]">
                Marque a gente nas fotos do seu evento · Pipoca, Churros e Batatas
              </p>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-[#2D160B] bg-[#FBBF24] hover:bg-[#F59E0B] rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <span>Abrir perfil no Instagram</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {activePost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Publicação ${activePost.category}`}
          onClick={() => setActivePost(null)}
          className="fixed inset-0 z-50 bg-[#2D160B]/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[#FFFDF9] border border-[#E8DCD0] overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8DCD0]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2D160B]">
                <Instagram className="w-4 h-4 text-[#C8232C]" aria-hidden="true" />
                <span>{INSTAGRAM_HANDLE}</span>
                <span className="text-[#D4BFA8]" aria-hidden="true">
                  ·
                </span>
                <span className="font-medium text-[#7A4B31]">{activePost.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                aria-label="Fechar visualização"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#5C3A28] hover:bg-[#FAF5EE] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] w-full bg-[#FAF5EE]">
              {!failedImages[activePost.id] ? (
                <img
                  src={activePost.image}
                  alt={activePost.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-center text-[#5C3A28]">
                  {activePost.category}
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm sm:text-base text-[#2D160B] leading-relaxed">
                {activePost.caption}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="px-4 py-2.5 text-sm font-semibold text-[#5C3A28] hover:bg-[#FAF5EE] rounded-xl transition-colors cursor-pointer min-h-[44px]"
                >
                  Fechar
                </button>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#C8232C] hover:bg-[#A61B23] rounded-xl transition-colors min-h-[44px]"
                >
                  <span>Ver no Instagram</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
