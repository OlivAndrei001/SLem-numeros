
import React from 'react';
import { ShieldCheck, Users, Globe, History, ArrowUpRight, BarChart4 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#004a99] mb-4 block">Manifesto do Projeto</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Transformando dados em <span className="text-[#004a99]">conhecimento</span> cidadão.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            O São Léo em Números é um observatório digital independente criado para monitorar, analisar e divulgar os indicadores que moldam o futuro de São Leopoldo, RS.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">
            {/* Mission Section */}
            <section className="grid sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#004a99]">
                  <BarChart4 size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Curadoria de Dados</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  Coletamos informações de fontes públicas e privadas para criar um panorama real sobre investimentos, obras e serviços na cidade.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#2d8b44]">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Independência Editorial</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  Não possuímos vínculo com órgãos governamentais. Nossa atuação é focada em publicidade informativa, transparência e jornalismo de dados.
                </p>
              </div>
            </section>

            {/* History Section */}
            <section className="bg-slate-50 rounded-[3rem] p-12 md:p-16 border border-slate-100">
              <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center uppercase tracking-tighter">
                <History className="mr-4 text-[#004a99]" /> São Leopoldo em Contexto
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6 font-medium">
                <p>
                  São Leopoldo, o Berço da Imigração Alemã no Brasil, é hoje um polo de tecnologia e indústria. Com uma história de mais de 200 anos, a cidade se reinventa constantemente através de sua força de trabalho e inovação.
                </p>
                <p>
                  O papel deste portal é registrar essa evolução por meio de números e fatos verificados, ajudando o cidadão a entender o desenvolvimento socioeconômico da região no ciclo atual.
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-12">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-blue-400">O Projeto</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                Operado como um canal de mídia independente, o São Léo em Números facilita o acesso à informação de qualidade de forma prática e visual.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group cursor-help">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Equipe</p>
                    <p className="text-sm font-bold">Conselho Editorial</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group cursor-help">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Alcance</p>
                    <p className="text-sm font-bold">Vale do Rio dos Sinos</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Documentação</h3>
              <div className="space-y-2">
                {[
                  'Metodologia de Dados',
                  'Termos de Uso',
                  'Política de Privacidade',
                  'Arquivo Digital'
                ].map((link, i) => (
                  <button 
                    key={i} 
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl text-sm font-bold text-slate-700 transition-all group"
                  >
                    {link} <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#004a99] transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default About;
