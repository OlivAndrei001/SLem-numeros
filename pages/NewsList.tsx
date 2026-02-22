
import React, { useState, useMemo, useEffect } from 'react';
import { fetchNews } from '../services/news-storage';
import { Category, NewsArticle } from '../types';
import { NewsCard } from '../components/NewsCard';
import { Search, Filter, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  const filteredNews = useMemo(() => {
    return news.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           n.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || n.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, news]);

  const categories = ['Todos', ...Object.values(Category)];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Portal de Notícias</h1>
            <p className="text-slate-600 max-w-2xl">Mantenha-se informado sobre as últimas decisões e eventos da Prefeitura de São Leopoldo.</p>
          </div>
          <Link to="/admin" className="flex items-center space-x-2 text-slate-400 hover:text-[#004a99] transition-colors text-sm font-medium">
            <Settings size={16} />
            <span>Acesso Editor</span>
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por palavras-chave..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex items-center text-slate-500 mr-2 shrink-0">
              <Filter size={18} className="mr-2" />
              <span className="text-sm font-medium">Filtrar:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                  selectedCategory === cat 
                    ? 'bg-[#004a99] text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map(newsItem => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800">Nenhuma notícia encontrada</h3>
            <p className="text-slate-500 mt-2">Tente ajustar seus filtros ou termos de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsList;