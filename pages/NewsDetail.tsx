
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsArticle, CityIndicator } from '../types';
import { fetchNews, fetchStats } from '../services/news-storage';
import { formatImageUrl } from '../utils/format';
import { Calendar, User, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Markdown from 'react-markdown';

const NewsDetail: React.FC = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedStat, setRelatedStat] = useState<CityIndicator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [news, stats] = await Promise.all([fetchNews(), fetchStats()]);
        const found = news.find(n => n.id === newsId);
        if (found) {
          setArticle(found);
          const stat = stats.find(s => s.category.toLowerCase() === found.category.toLowerCase());
          setRelatedStat(stat || null);
        }
      } catch (err) {
        console.error("Erro ao carregar notícia:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    window.scrollTo(0, 0);
  }, [newsId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#004a99] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Notícia não encontrada</h2>
        <Link to="/noticias" className="text-[#004a99] font-bold hover:underline">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={formatImageUrl(article.imageurl)} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-4xl mx-auto">
            <Link to="/noticias" className="inline-flex items-center text-white/60 hover:text-white mb-8 text-xs font-black uppercase tracking-widest transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Voltar para notícias
            </Link>
            <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-8">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-white/60 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center"><Calendar size={16} className="mr-2 text-blue-400" /> {new Date(article.date).toLocaleDateString('pt-BR')}</span>
              <span className="flex items-center"><User size={16} className="mr-2 text-blue-400" /> {article.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2">
            <div className="markdown-body prose prose-slate prose-lg max-w-none">
              <Markdown>{article.content}</Markdown>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            {relatedStat && (
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block">Indicador Relacionado</span>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">{relatedStat.label}</h3>
                  <div className={`p-2 rounded-xl ${
                    relatedStat.trend === 'up' ? 'bg-emerald-100 text-[#2d8b44]' : 
                    relatedStat.trend === 'down' ? 'bg-rose-100 text-[#d9262e]' : 'bg-blue-100 text-[#004a99]'
                  }`}>
                    {relatedStat.trend === 'up' ? <TrendingUp size={18} /> : 
                     relatedStat.trend === 'down' ? <TrendingDown size={18} /> : <Minus size={18} />}
                  </div>
                </div>
                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tighter break-all">{relatedStat.value}</span>
                  <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{relatedStat.suffix}</span>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  {relatedStat.description || 'Acompanhe a evolução deste indicador em nosso portal de transparência.'}
                </p>
                <Link to="/" className="block w-full text-center py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                  Ver todos os números
                </Link>
              </div>
            )}

            <div className="p-8 bg-[#004a99] rounded-[2.5rem] text-white">
              <h4 className="text-lg font-black uppercase tracking-tighter mb-4">Portal Independente</h4>
              <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-80">
                O São Léo em Números é um projeto focado em transparência e dados públicos de São Leopoldo.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
