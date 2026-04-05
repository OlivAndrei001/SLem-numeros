
import React, { useState, useEffect } from 'react';
import { Category, NewsArticle, CityIndicator, BannerConfig, GlobalConfig, CityProject, TaxConfig } from '../types';
import { formatImageUrl } from '../utils/format';
import { 
  fetchNews, saveNews, deleteNews, 
  fetchStats, saveStat, deleteStat, DEFAULT_STATS,
  fetchBannerConfig, saveBannerConfig,
  fetchGlobalConfig, saveGlobalConfig,
  fetchTaxConfig, saveTaxConfig
} from '../services/news-storage';
import { supabase } from '../services/supabase';
import { 
  Plus, Trash2, FileText, CheckCircle2, 
  AlertCircle, BarChart3, Settings, Save, Layout as LayoutIcon, LogOut, Palette, Loader2, User, Lock, Mail, Coins, RefreshCcw
} from 'lucide-react';

const AdminNews: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'noticias' | 'numeros' | 'banner' | 'identidade' | 'impostometro'>('noticias');
  
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [statsList, setStatsList] = useState<CityIndicator[]>([]);
  const [bannerForm, setBannerForm] = useState<BannerConfig | null>(null);
  const [globalForm, setGlobalForm] = useState<GlobalConfig | null>(null);
  const [taxForm, setTaxForm] = useState<TaxConfig | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [newsForm, setNewsForm] = useState({
    title: '', summary: '', content: '', imageurl: '', 
    category: Category.ADMINISTRATION, author: 'Redação São Léo em Números'
  });

  const [statForm, setStatForm] = useState<Omit<CityIndicator, 'id'>>({
    label: '', value: '', suffix: '', trend: 'up', category: Category.EDUCATION, color: 'blue', description: '', projects: []
  });

  // Verifica se o usuário já está logado ao carregar a página
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Carrega os dados apenas se houver sessão ativa
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [n, s, b, g, t] = await Promise.all([
          fetchNews(),
          fetchStats(),
          fetchBannerConfig(),
          fetchGlobalConfig(),
          fetchTaxConfig()
        ]);
        setNewsList(n);
        setStatsList(s);
        setBannerForm(b);
        setGlobalForm(g);
        setTaxForm(t);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    if (session) loadAllData();
  }, [session]);

  const showStatus = (msg: string, type: 'success' | 'error' = 'success') => {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      showStatus('Login realizado com sucesso!');
    } catch (err: any) {
      alert('Erro no login: ' + (err.message || 'Verifique suas credenciais.'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newArt: NewsArticle = { ...newsForm, id: `temp-${Date.now()}`, date: new Date().toISOString().split('T')[0] };
      await saveNews(newArt);
      const updated = await fetchNews();
      setNewsList(updated);
      setNewsForm({ title: '', summary: '', content: '', imageurl: '', category: Category.ADMINISTRATION, author: 'Redação São Léo em Números' });
      showStatus('Notícia publicada na Tabela Noticias!');
    } catch (err) {
      showStatus('Erro ao salvar notícia', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreStats = async () => {
    if (!confirm('Deseja restaurar os indicadores de exemplo? Eles serão salvos no banco de dados para que você possa editá-los.')) return;
    setIsSaving(true);
    try {
      for (const ex of DEFAULT_STATS) {
        await saveStat(ex);
      }
      const updated = await fetchStats();
      setStatsList(updated);
      showStatus('Indicadores de exemplo restaurados e salvos no banco!');
    } catch (err: any) {
      console.error("Erro ao restaurar exemplos:", err);
      showStatus(`Erro ao restaurar: ${err.message || 'Verifique a conexão'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newStat: CityIndicator = { ...statForm, id: `temp-${Date.now()}` };
      await saveStat(newStat);
      const updated = await fetchStats();
      setStatsList(updated);
      setStatForm({ label: '', value: '', suffix: '', trend: 'up', category: Category.EDUCATION, color: 'blue', description: '', projects: [] });
      showStatus('Indicador sincronizado!');
    } catch (err: any) {
      console.error("Erro ao salvar indicador:", err);
      showStatus(`Erro ao salvar: ${err.message || 'Verifique a conexão'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm) return;
    setIsSaving(true);
    try {
      await saveBannerConfig(bannerForm);
      showStatus('Banner atualizado com sucesso!');
    } catch (err) {
      showStatus('Erro ao atualizar banner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalForm) return;
    setIsSaving(true);
    try {
      await saveGlobalConfig(globalForm);
      showStatus('Identidade visual atualizada!');
    } catch (err) {
      showStatus('Erro ao salvar identidade', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxForm) return;
    setIsSaving(true);
    try {
      await saveTaxConfig(taxForm);
      showStatus('Impostômetro atualizado!');
    } catch (err) {
      showStatus('Erro ao salvar impostômetro', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#004a99] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-black/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-md w-full border border-white/20 relative z-10">
          <div className="text-center mb-10">
            <div className="bg-blue-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock className="text-[#004a99]" size={42} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Acesso Restrito</h2>
            <p className="text-slate-400 mt-3 font-bold text-[10px] uppercase tracking-[0.2em]">Painel de Controle Oficial</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Seu e-mail cadastrado"
                required
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-semibold text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Sua senha segura"
                required
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-semibold text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              disabled={isLoggingIn}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-[#004a99] transition-all shadow-2xl shadow-slate-900/20 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-3"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" size={18} /> : <span>Autenticar no Supabase</span>}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Apenas administradores autorizados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center space-x-3">
              <div className="bg-[#004a99] text-white w-9 h-9 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center font-black text-base lg:text-xl shadow-lg shadow-blue-900/20">SL</div>
              <div>
                <h1 className="text-[10px] lg:text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">Gestão de Conteúdo</h1>
                <p className="text-[7px] lg:text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Conectado ao Supabase</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="hidden xl:flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <User size={12} className="text-slate-400 mr-2" />
                <span className="text-[9px] font-bold text-slate-600 truncate max-w-[120px]">{session.user.email}</span>
              </div>
              <button onClick={handleLogout} className="lg:hidden p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><LogOut size={16} /></button>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-hide">
            <button onClick={() => setActiveTab('noticias')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'noticias' ? 'bg-[#004a99] text-white shadow-md shadow-blue-900/10' : 'text-slate-400 hover:bg-slate-50'}`}>Notícias</button>
            <button onClick={() => setActiveTab('numeros')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'numeros' ? 'bg-[#004a99] text-white shadow-md shadow-blue-900/10' : 'text-slate-400 hover:bg-slate-50'}`}>Números</button>
            <button onClick={() => setActiveTab('impostometro')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'impostometro' ? 'bg-[#004a99] text-white shadow-md shadow-blue-900/10' : 'text-slate-400 hover:bg-slate-50'}`}>Impostos</button>
            <button onClick={() => setActiveTab('banner')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'banner' ? 'bg-[#004a99] text-white shadow-md shadow-blue-900/10' : 'text-slate-400 hover:bg-slate-50'}`}>Banner</button>
            <button onClick={() => setActiveTab('identidade')} className={`whitespace-nowrap px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'identidade' ? 'bg-[#004a99] text-white shadow-md shadow-blue-900/10' : 'text-slate-400 hover:bg-slate-50'}`}>ID Visual</button>
            <button onClick={handleLogout} className="hidden lg:flex flex-shrink-0 p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><LogOut size={18} /></button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-6 lg:mt-12">
        {status && (
          <div className={`mb-8 p-6 rounded-3xl flex items-center space-x-4 border animate-in slide-in-from-top duration-500 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}`}>
            {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-bold text-sm uppercase tracking-tight">{status.msg}</span>
          </div>
        )}

        {activeTab === 'noticias' && (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
            <div className="lg:col-span-1">
              <div className="bg-white p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-slate-200">
                <h3 className="text-lg sm:text-xl font-black mb-6 sm:mb-8 uppercase tracking-tighter">Publicar Nova Matéria</h3>
                <form onSubmit={handleSaveNews} className="space-y-4 sm:space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Manchete</label>
                    <input placeholder="Título impactante..." required className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                      <select className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold capitalize" value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value as Category})}>
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Autor</label>
                      <input placeholder="Nome do autor..." className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" value={newsForm.author} onChange={e => setNewsForm({...newsForm, author: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Resumo (Lead)</label>
                    <textarea placeholder="Breve resumo da notícia..." required rows={2} className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" value={newsForm.summary} onChange={e => setNewsForm({...newsForm, summary: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo da Matéria</label>
                    <textarea placeholder="Texto completo da notícia..." required rows={6} className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Imagem Principal (URL)</label>
                    <input placeholder="https://..." className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold" value={newsForm.imageurl} onChange={e => setNewsForm({...newsForm, imageurl: e.target.value})} />
                  </div>
                  <button type="submit" disabled={isSaving} className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black flex items-center justify-center space-x-2 shadow-xl shadow-slate-900/10 hover:bg-[#004a99] transition-all text-[10px] uppercase tracking-widest">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <span>Publicar na Tabela Noticias</span>}
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm divide-y">
                <div className="p-6 sm:p-8 bg-slate-50 border-b">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Histórico de Publicações</h3>
                </div>
                {newsList.length > 0 ? newsList.map(item => (
                  <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4 sm:space-x-5">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-white flex-shrink-0">
                        <img src={formatImageUrl(item.imageurl)} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <button onClick={async () => { if(confirm('Tem certeza que deseja excluir esta notícia do banco?')) { await deleteNews(item.id); setNewsList(await fetchNews()); showStatus('Notícia removida.'); } }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"><Trash2 size={18} /></button>
                  </div>
                )) : (
                  <div className="p-20 text-center">
                    <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Nenhuma notícia cadastrada.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'numeros' && (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
            <div className="lg:col-span-1">
              <div className="bg-white p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border shadow-sm">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter">Gerenciar Indicadores</h3>
                  <button 
                    onClick={handleRestoreStats}
                    className="p-2 text-slate-400 hover:text-[#004a99] hover:bg-blue-50 rounded-xl transition-all"
                    title="Restaurar Exemplos"
                  >
                    <RefreshCcw size={18} />
                  </button>
                </div>
                <form onSubmit={handleSaveStat} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Rótulo do Dado</label>
                    <input placeholder="Ex: População Estimada" required className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm font-semibold" value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor</label>
                      <input placeholder="15.000" required className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm font-semibold" value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sufixo</label>
                      <input placeholder="hab" required className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm font-semibold" value={statForm.suffix} onChange={e => setStatForm({...statForm, suffix: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tendência</label>
                      <select className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm font-semibold" value={statForm.trend} onChange={e => setStatForm({...statForm, trend: e.target.value as any})}>
                        <option value="up">Crescimento (Up)</option>
                        <option value="down">Queda (Down)</option>
                        <option value="stable">Estável (Stable)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cor do Card</label>
                      <select className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm font-semibold" value={statForm.color} onChange={e => setStatForm({...statForm, color: e.target.value})}>
                        <option value="blue">Azul</option>
                        <option value="emerald">Verde</option>
                        <option value="rose">Vermelho</option>
                        <option value="amber">Laranja</option>
                        <option value="indigo">Índigo</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                    <select className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm font-semibold capitalize" value={statForm.category} onChange={e => setStatForm({...statForm, category: e.target.value})}>
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={isSaving} className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-[#004a99] transition-all">
                    {isSaving ? <Loader2 className="animate-spin mx-auto" /> : "Sincronizar na Tabela Stats"}
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
               <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {statsList.map(stat => (
                  <div key={stat.id} className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border shadow-sm flex justify-between items-center group hover:border-blue-200 transition-all">
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase text-blue-600 tracking-[0.2em] mb-1">{stat.category}</p>
                      <p className="font-bold text-slate-900 truncate text-sm sm:text-base">{stat.label}</p>
                      <p className="text-xl sm:text-3xl font-black tracking-tighter text-slate-950 truncate">{stat.value} <span className="text-[10px] sm:text-sm text-slate-300 font-bold">{stat.suffix}</span></p>
                    </div>
                    <button onClick={async () => { if(confirm('Excluir indicador?')) { await deleteStat(stat.id); setStatsList(await fetchStats()); showStatus('Indicador removido.'); } }} className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl text-slate-200 hover:text-rose-500 hover:bg-rose-50 transition-all"><Trash2 size={18} /></button>
                  </div>
                ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'banner' && bannerForm && (
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleUpdateBanner} className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border shadow-sm space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Banner Principal da Home</h3>
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 mt-2">Esta seção aparece no topo da página inicial para avisos importantes.</p>
              </div>
              <div className="grid gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Título</label>
                  <input className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-semibold text-sm" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Destaque Colorido</label>
                  <input className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-black text-blue-600 uppercase text-sm" value={bannerForm.highlight} onChange={e => setBannerForm({...bannerForm, highlight: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mensagem de Descrição</label>
                  <textarea rows={3} className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-semibold text-sm" value={bannerForm.description} onChange={e => setBannerForm({...bannerForm, description: e.target.value})} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Texto do Botão</label>
                    <input className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-semibold text-sm" value={bannerForm.buttontext} onChange={e => setBannerForm({...bannerForm, buttontext: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Link de Destino</label>
                    <input className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-semibold text-sm" value={bannerForm.link} onChange={e => setBannerForm({...bannerForm, link: e.target.value})} />
                  </div>
                </div>
              </div>
              <button disabled={isSaving} className="w-full bg-slate-900 text-white py-5 sm:py-6 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:bg-[#004a99] transition-all">
                {isSaving ? <Loader2 className="animate-spin mx-auto" /> : "Atualizar Visual do Portal"}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'identidade' && globalForm && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleUpdateGlobal} className="bg-white p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[3.5rem] border shadow-sm space-y-6 sm:space-y-8">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Marca e Identidade</h3>
              <div className="space-y-5 sm:space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">URL do Logotipo (PNG/SVG)</label>
                  <input placeholder="Link da imagem do brasão..." className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-semibold text-sm" value={globalForm.logourl} onChange={e => setGlobalForm({...globalForm, logourl: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Cidade / Título Principal</label>
                  <input placeholder="Ex: SÃO LEOPOLDO" className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-black uppercase text-sm" value={globalForm.cityname} onChange={e => setGlobalForm({...globalForm, cityname: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Slogan ou Complemento</label>
                  <input placeholder="Ex: EM NÚMEROS" className="w-full px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-black uppercase text-blue-600 text-sm" value={globalForm.cityslogan} onChange={e => setGlobalForm({...globalForm, cityslogan: e.target.value})} />
                </div>
              </div>
              <button disabled={isSaving} className="w-full bg-slate-900 text-white py-5 sm:py-6 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:bg-[#004a99] transition-all">
                {isSaving ? <Loader2 className="animate-spin mx-auto" /> : "Salvar Alterações de Marca"}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'impostometro' && taxForm && (
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleUpdateTax} className="bg-white p-5 sm:p-12 rounded-[1.5rem] sm:rounded-[3.5rem] border shadow-sm space-y-6 sm:space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tighter">Configuração do Impostômetro</h3>
                  <p className="text-[9px] sm:text-xs font-bold text-slate-400 mt-2">Defina os valores reais extraídos dos portais oficiais.</p>
                </div>
                <Coins className="text-blue-600 hidden sm:block" size={32} />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Título da Seção</label>
                  <input className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-semibold text-sm" value={taxForm.title} onChange={e => setTaxForm({...taxForm, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                  <input className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-semibold text-sm" value={taxForm.description} onChange={e => setTaxForm({...taxForm, description: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Última Atualização</label>
                  <input className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border bg-slate-50 font-semibold text-sm" value={taxForm.lastUpdate} onChange={e => setTaxForm({...taxForm, lastUpdate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">Setores de Arrecadação</h4>
                {taxForm.sectors.map((sector, index) => (
                  <div key={sector.id} className="p-4 sm:p-6 bg-slate-50 rounded-xl sm:rounded-3xl border border-slate-100 grid sm:grid-cols-3 gap-4 sm:gap-6 items-end">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Setor</label>
                      <input className="w-full px-3 py-2 rounded-lg border bg-white font-bold text-xs sm:text-sm" value={sector.name} onChange={e => {
                        const newSectors = [...taxForm.sectors];
                        newSectors[index].name = e.target.value;
                        setTaxForm({...taxForm, sectors: newSectors});
                      }} />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Real Arrecadado (R$)</label>
                      <input type="number" className="w-full px-3 py-2 rounded-lg border bg-white font-bold text-xs sm:text-sm" value={sector.baseValue} onChange={e => {
                        const newSectors = [...taxForm.sectors];
                        newSectors[index].baseValue = Number(e.target.value);
                        setTaxForm({...taxForm, sectors: newSectors});
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <button disabled={isSaving} className="w-full bg-slate-900 text-white py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 hover:bg-[#004a99] transition-all">
                {isSaving ? <Loader2 className="animate-spin mx-auto" /> : "Salvar Configurações Reais"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNews;