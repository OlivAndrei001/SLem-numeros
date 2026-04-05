
import React, { useState, useEffect } from 'react';
import { NewsArticle, CityIndicator, BannerConfig, TaxConfig } from '../types';
import { fetchNews, fetchStats, fetchBannerConfig, fetchTaxConfig } from '../services/news-storage';
import { NewsCard } from '../components/NewsCard';
import { OfficialBanner } from '../components/OfficialBanner';
import { StatsDashboard } from '../components/StatsDashboard';
import { TaxMeter } from '../components/TaxMeter';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [stats, setStats] = useState<CityIndicator[]>([]);
  const [banner, setBanner] = useState<BannerConfig | null>(null);
  const [taxConfig, setTaxConfig] = useState<TaxConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.warn("Carregamento do Supabase demorando demais, forçando inicialização...");
          setLoading(false);
        }
      }, 8000); // 8 segundos de timeout

      try {
        console.log("Iniciando carregamento de dados do Supabase...");
        const [newsData, statsData, bannerData, taxData] = await Promise.all([
          fetchNews().catch(err => { console.error("Erro fetchNews:", err); return []; }),
          fetchStats().catch(err => { console.error("Erro fetchStats:", err); return []; }),
          fetchBannerConfig().catch(err => { console.error("Erro fetchBanner:", err); return null; }),
          fetchTaxConfig().catch(err => { console.error("Erro fetchTax:", err); return null; })
        ]);
        
        console.log("Dados carregados com sucesso:", { 
          news: newsData.length, 
          stats: statsData.length, 
          banner: !!bannerData, 
          tax: !!taxData 
        });

        setNews(newsData);
        setStats(statsData);
        setBanner(bannerData);
        setTaxConfig(taxData);
      } catch (err) {
        console.error("Erro crítico ao carregar dados do Supabase:", err);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const featuredNews = news[0];
  const latestNews = news.slice(1, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Sincronizando com Supabase</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Carregando dados oficiais...</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-12 pb-8">
        {taxConfig && <TaxMeter config={taxConfig} />}
      </div>

      {banner && <OfficialBanner config={banner} />}

      <StatsDashboard indicators={stats} allNews={news} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 border-t border-slate-50">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-12 md:space-y-16">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 md:pb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Destaque Editorial</h2>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-3 block">Curadoria São Léo em Números</span>
              </div>
              <Link to="/noticias" className="hidden sm:flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                <span>Ver Arquivo</span> <ChevronRight size={14} />
              </Link>
            </div>
            
            {featuredNews ? (
              <NewsCard news={featuredNews} featured />
            ) : (
              <div className="h-96 rounded-[3rem] bg-slate-50 flex items-center justify-center">
                <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Nenhum destaque encontrado.</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-10">
              {latestNews.map(item => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="p-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">Categorias Populares</h4>
              <div className="flex flex-wrap gap-2">
                {['infraestrutura', 'saúde', 'segurança', 'educação', 'social'].map(cat => (
                  <span key={cat} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-32">
        <div className="bg-[#004a99] rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 md:p-24 relative overflow-hidden shadow-2xl group">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 sm:mb-10">
              Acompanhe a cidade através de dados.
            </h3>
            <p className="text-blue-100 text-lg sm:text-xl font-medium leading-relaxed mb-10 sm:mb-12 opacity-80">
              Monitoramento independente de investimentos, obras e indicadores sociais de São Leopoldo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/noticias" className="w-full sm:w-auto text-center bg-white text-slate-900 px-10 py-5 rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                Explorar Notícias
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;