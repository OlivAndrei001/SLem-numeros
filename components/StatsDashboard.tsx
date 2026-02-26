
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, X, ChevronRight, LayoutList } from 'lucide-react';
import { CityIndicator, NewsArticle } from '../types';
import { formatImageUrl } from '../utils/format';
import { Link } from 'react-router-dom';

interface StatsDashboardProps {
  indicators: CityIndicator[];
  allNews?: NewsArticle[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ indicators, allNews = [] }) => {
  const [selectedStat, setSelectedStat] = useState<CityIndicator | null>(null);

  const getRelatedNews = (category: string) => {
    return allNews.filter(n => n.category.toLowerCase() === category.toLowerCase()).slice(0, 3);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="flex items-center justify-between mb-8 border-l-4 border-[#d9262e] pl-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">São Léo em Números</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-70 mt-1">Clique nos cartões para ver projetos e detalhes</p>
        </div>
        <div className="hidden md:flex items-center text-[10px] text-slate-400 font-black uppercase tracking-tighter">
          <Info size={14} className="mr-1 text-[#2d8b44]" /> Baseado em dados da transparência
        </div>
      </div>
      
      {indicators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {indicators.map((stat) => (
            <button 
              key={stat.id} 
              onClick={() => setSelectedStat(stat)}
              className="text-left bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-50 pb-1">{stat.category}</span>
                <div className={`p-2 rounded-xl transition-colors ${
                  stat.trend === 'up' ? 'bg-emerald-50 text-[#2d8b44]' : 
                  stat.trend === 'down' ? 'bg-rose-50 text-[#d9262e]' : 'bg-blue-50 text-[#004a99]'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={18} /> : 
                   stat.trend === 'down' ? <TrendingDown size={18} /> : <Minus size={18} />}
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tighter group-hover:text-[#004a99] transition-colors break-all">{stat.value}</span>
                <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{stat.suffix}</span>
              </div>
              <h4 className="text-slate-700 font-bold mt-3 text-sm leading-tight flex items-center justify-between">
                {stat.label}
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all text-[#004a99]" />
              </h4>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Nenhum indicador cadastrado no painel administrativo.</p>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedStat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header Modal */}
            <div className="bg-slate-950 px-8 py-8 sm:px-12 text-white relative">
              <button 
                onClick={() => setSelectedStat(null)}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2 block">
                Detalhamento: {selectedStat.category}
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none mb-4">
                {selectedStat.label}
              </h3>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-black text-white">{selectedStat.value}</span>
                <span className="text-[10px] sm:text-sm font-black text-blue-400 uppercase tracking-widest">{selectedStat.suffix}</span>
              </div>
            </div>

            {/* Content Modal */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-10">
              {selectedStat.description && (
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Sobre este Indicador</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {selectedStat.description}
                  </p>
                </section>
              )}

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Notícias Relacionadas</h4>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
                <div className="space-y-3">
                  {getRelatedNews(selectedStat.category).length > 0 ? (
                    getRelatedNews(selectedStat.category).map(news => (
                      <Link 
                        key={news.id} 
                        to={`/noticias/${news.id}`}
                        className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group"
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={formatImageUrl(news.imageurl)} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#004a99] transition-colors">{news.title}</h5>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{new Date(news.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Nenhuma notícia recente nesta categoria.</p>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Projetos Ativos</h4>
                  <LayoutList size={14} className="text-slate-300" />
                </div>
                
                <div className="space-y-4">
                  {selectedStat.projects && selectedStat.projects.length > 0 ? (
                    selectedStat.projects.map((project) => (
                      <div key={project.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-100 transition-colors">
                        <h5 className="font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-[#004a99] transition-colors">{project.name}</h5>
                        <p className="text-sm text-slate-500 leading-relaxed">{project.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nenhum projeto detalhado registrado para este indicador.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Footer Modal */}
            <div className="px-12 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fonte: Portal da Transparência de São Leopoldo</p>
              <button 
                onClick={() => setSelectedStat(null)}
                className="text-xs font-black uppercase tracking-widest text-[#004a99] hover:underline"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
