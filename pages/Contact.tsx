
import React, { useState } from 'react';
import { Mail, Send, MessageCircle, Zap, Share2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Publicidade', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <div className="space-y-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#004a99] mb-6 block">Fale com a Redação</span>
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-8">
                Vamos falar sobre a <span className="text-[#004a99]">cidade?</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                Seja para parcerias de publicidade, sugestões de pauta ou correções de dados, nosso time está pronto para ouvir você.
              </p>
            </div>

            <div className="grid gap-8">
              <div className="flex items-start space-x-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="bg-blue-600 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-1">E-mail Comercial</h3>
                  <p className="text-slate-500 font-medium">comercial@saoleoemnumeros.com.br</p>
                </div>
              </div>

              <div className="flex items-start space-x-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-colors">
                <div className="bg-[#2d8b44] p-4 rounded-2xl text-white group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-1">Mídia & Parcerias</h3>
                  <p className="text-slate-500 font-medium">redacao@saoleoemnumeros.com.br</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8 pt-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Redes Sociais</span>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Share2 size={20} /></a>
                  <a href="#" className="p-3 bg-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><MessageCircle size={20} /></a>
                </div>
              </div>
              <div className="h-12 w-[1px] bg-slate-100"></div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">
                Operação independente baseada em São Leopoldo, RS.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 relative z-10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black tracking-tighter uppercase">Mensagem Direta</h3>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Identificação</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Seu nome ou organização"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">E-mail para resposta</label>
                  <input 
                    required
                    type="email" 
                    placeholder="voce@exemplo.com"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assunto</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 appearance-none"
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>Publicidade & Mídia</option>
                    <option>Sugestão de Pauta</option>
                    <option>Dados & Estatísticas</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mensagem</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Como podemos ajudar?"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none"
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={submitted}
                  className={`w-full flex items-center justify-center space-x-3 py-5 rounded-[2rem] font-black text-white transition-all shadow-2xl uppercase tracking-widest text-xs ${
                    submitted ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-blue-700'
                  }`}
                >
                  {submitted ? <span>Mensagem Enviada!</span> : <><Send size={18} /> <span>Enviar para Redação</span></>}
                </button>
              </form>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-[100px] -z-10 opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-100 rounded-full blur-[100px] -z-10 opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
