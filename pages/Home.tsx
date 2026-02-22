
import React, { useState, useEffect } from 'react';
import { NewsArticle, CityIndicator, BannerConfig } from '../types';
import { fetchNews, fetchStats, fetchBannerConfig } from '../services/news-storage';
import { NewsCard } from '../components/NewsCard';
import { OfficialBanner } from '../components/OfficialBanner';
import { StatsDashboard } from '../components/StatsDashboard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [stats, setStats] = useState<CityIndicator[]>([]);
  const [banner, setBanner] = useState<BannerConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [newsData, statsData, bannerData] = await Promise.all([
          fetchNews(),
          fetchStats(),
          fetchBannerConfig()
        ]);
        setNews(newsData);
        setStats(statsData);
        setBanner(bannerData);
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const featuredNews = news[0];
  const latestNews = news.slice(1, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sincronizando com Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-12 pb-8">
        {banner && <OfficialBanner config={banner} />}
      </div>

      <StatsDashboard indicators={stats} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-50">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <div className="flex items-center justify-between border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Destaque Editorial</h2>
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
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="bg-[#004a99] rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl group">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-10">
              Acompanhe a cidade através de dados.
            </h3>
            <p className="text-blue-100 text-xl font-medium leading-relaxed mb-12 opacity-80">
              Monitoramento independente de investimentos, obras e indicadores sociais de São Leopoldo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/noticias" className="bg-white text-slate-900 px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
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