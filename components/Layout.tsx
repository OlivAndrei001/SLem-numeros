
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Youtube, Mail, Globe } from 'lucide-react';
import { fetchGlobalConfig } from '../services/news-storage';
import { GlobalConfig } from '../types';

const formatImageUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/(.+?)(\/|$|#|\?)/) || url.match(/id=(.+?)(&|$|#)/);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}=w1000`;
    }
  }
  return url;
};

const Logo: React.FC<{ className?: string, config: GlobalConfig | null }> = ({ className, config }) => {
  const [src, setSrc] = useState(config ? formatImageUrl(config.logourl) : '');

  useEffect(() => {
    if (config) setSrc(formatImageUrl(config.logourl));
  }, [config]);

  const handleError = () => {
    const fallback = "https://xvkprodimxdshfekcfmf.supabase.co/storage/v1/object/public/Logo%20do%20site/brasao.png.png";
    if (src !== fallback) {
      setSrc(fallback);
    }
  };

  return (
    <div className="relative flex items-center">
      <img 
        src={src || "https://xvkprodimxdshfekcfmf.supabase.co/storage/v1/object/public/Logo%20do%20site/brasao.png.png"} 
        alt="Logo" 
        className={`${className} transition-opacity duration-300`}
        onError={handleError}
      />
    </div>
  );
};

const Navbar: React.FC<{ config: GlobalConfig | null }> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Notícias', path: '/noticias' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <Logo className="h-10 w-auto transition-transform group-hover:scale-110" config={config} />
              <div className="flex flex-col">
                <h1 className="text-slate-900 font-black text-lg leading-none tracking-tighter uppercase">
                  {config?.cityname || 'SÃO LÉO'} <span className="text-[#004a99]">{config?.cityslogan || 'EM NÚMEROS'}</span>
                </h1>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Portal de Dados Independente</p>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#004a99] ${
                  isActive(link.path) ? 'text-[#004a99]' : 'text-slate-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-sm font-black uppercase tracking-widest text-slate-600"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC<{ config: GlobalConfig | null }> = ({ config }) => {
  return (
    <footer className="bg-white text-slate-900 pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <Logo className="h-10 w-auto" config={config} />
              <h2 className="font-black text-xl tracking-tighter uppercase">
                {config?.cityname || 'SÃO LÉO'} <span className="text-[#004a99]">{config?.cityslogan || 'EM NÚMEROS'}</span>
              </h2>
            </Link>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              Curadoria de dados e notícias de São Leopoldo. Informação clara para o cidadão consciente. Projeto independente focado em transparência.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><Youtube size={18} /></a>
            </div>
          </div>

          <div className="md:text-right flex flex-col md:items-end">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Informações de Contato</h3>
            <ul className="space-y-4 text-sm font-medium text-slate-600">
              <li className="flex items-center md:justify-end space-x-3">
                <Mail size={16} className="text-[#004a99]" />
                <span>contato@saoleoemnumeros.com.br</span>
              </li>
              <li className="flex items-center md:justify-end space-x-3">
                <Globe size={16} className="text-[#2d8b44]" />
                <span>www.saoleoemnumeros.com.br</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">© 2026 SÃO LÉO EM NÚMEROS • PROJETO INDEPENDENTE</p>
          <div className="flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link to="/admin" className="hover:text-slate-900 transition-colors">Acesso Restrito</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<GlobalConfig | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const data = await fetchGlobalConfig();
      setConfig(data);
    };
    loadConfig();
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#004a99] selection:text-white">
      <Navbar config={config} />
      <main className="flex-1">
        {children}
      </main>
      <Footer config={config} />
    </div>
  );
};
