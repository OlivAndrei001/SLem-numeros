
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={48} className="text-slate-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">404</h1>
          <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">Página não encontrada</p>
        </div>
        <p className="text-slate-400 max-w-xs mx-auto font-medium">
          O conteúdo que você está procurando não existe ou foi movido para outro endereço.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 bg-[#004a99] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-blue-900/20"
        >
          <Home size={18} />
          <span>Voltar ao Início</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
