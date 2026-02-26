
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';
import { formatImageUrl } from '../utils/format';

interface NewsCardProps {
  news: NewsArticle;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, featured = false }) => {
  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-[2rem] sm:rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100">
        <div className="grid md:grid-cols-2">
          <div className="aspect-video md:aspect-auto h-full overflow-hidden">
            <img 
              src={formatImageUrl(news.imageurl)} 
              alt={news.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-5 sm:space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-[#004a99] text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full">
                {news.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 group-hover:text-[#004a99] transition-colors leading-tight">
              {news.title}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed line-clamp-3 sm:line-clamp-none">
              {news.summary}
            </p>
            <div className="flex flex-wrap items-center text-[10px] sm:text-sm text-slate-500 gap-4 sm:gap-6">
              <span className="flex items-center"><Calendar size={14} className="mr-2 text-blue-400" /> {new Date(news.date).toLocaleDateString('pt-BR')}</span>
              <span className="flex items-center"><User size={14} className="mr-2 text-blue-400" /> {news.author}</span>
            </div>
            <Link 
              to={`/noticias/${news.id}`}
              className="inline-flex items-center font-black text-[10px] sm:text-xs uppercase tracking-widest text-[#004a99] hover:underline group/link"
            >
              Leia o artigo completo <ArrowRight size={18} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={formatImageUrl(news.imageurl)} 
          alt={news.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 space-y-4">
        <span className="text-[10px] font-bold text-[#004a99] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
          {news.category}
        </span>
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#004a99] transition-colors line-clamp-2">
          {news.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-3">
          {news.summary}
        </p>
        <div className="pt-4 flex items-center justify-between border-t border-slate-50">
          <div className="flex items-center text-[10px] text-slate-400 font-medium">
            <Calendar size={12} className="mr-1" />
            {new Date(news.date).toLocaleDateString('pt-BR')}
          </div>
          <Link 
            to={`/noticias/${news.id}`}
            className="text-sm font-bold text-[#004a99] flex items-center group/btn"
          >
            Leia mais <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
