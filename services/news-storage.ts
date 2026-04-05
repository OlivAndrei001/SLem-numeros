
import { Category, NewsArticle, CityIndicator, BannerConfig, GlobalConfig, TaxConfig } from '../types';
import { supabase } from './supabase';
import { MOCK_NEWS } from '../constants';

// Valores padrão para o caso de o banco estar vazio
const DEFAULT_TAX_CONFIG: TaxConfig = {
  title: 'Impostômetro São Leopoldo',
  description: 'Valores reais de arrecadação municipal extraídos diretamente dos portais de transparência oficiais (Portal da Transparência, Siconfi e Receita Estadual).',
  lastUpdate: '05/04/2026',
  sectors: [
    { id: '1', name: 'ISS (Serviços)', dailyAverage: 0, baseValue: 168450230.45, color: 'blue' },
    { id: '2', name: 'IPTU (Propriedade)', dailyAverage: 0, baseValue: 98720150.80, color: 'emerald' },
    { id: '3', name: 'ICMS (Repasse RS)', dailyAverage: 0, baseValue: 245120840.15, color: 'amber' },
    { id: '4', name: 'FPM (Repasse União)', dailyAverage: 0, baseValue: 182340950.60, color: 'indigo' }
  ]
};

const DEFAULT_BANNER: BannerConfig = {
  title: 'São Leopoldo Avança:',
  highlight: 'Novo Plano Diretor 2026',
  description: 'Participe das audiências públicas e ajude a planejar o futuro da nossa cidade para a próxima década.',
  buttontext: 'Saiba mais detalhes',
  link: '#'
};

const DEFAULT_CONFIG: GlobalConfig = {
  logourl: 'https://xvkprodimxdshfekcfmf.supabase.co/storage/v1/object/public/Logo%20do%20site/brasao.png.png',
  cityname: 'São Leopoldo',
  cityslogan: 'Em Números'
};

// --- Notícias ---
export const fetchNews = async (): Promise<NewsArticle[]> => {
  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Erro Supabase fetchNews:", error);
      return MOCK_NEWS;
    }
    
    if (!data || data.length === 0) {
      console.log("Nenhuma notícia no banco, usando MOCK_NEWS");
      return MOCK_NEWS;
    }
    
    return data;
  } catch (err) {
    console.error("Falha na rede fetchNews:", err);
    return MOCK_NEWS;
  }
};

export const saveNews = async (news: NewsArticle) => {
  const { id, ...newsData } = news;
  const dataToSave = id.startsWith('temp-') ? newsData : news;
  const { error } = await supabase.from('noticias').insert([dataToSave]);
  if (error) {
    console.error("Erro saveNews:", error);
    throw error;
  }
};

export const deleteNews = async (id: string) => {
  const { error } = await supabase.from('noticias').delete().eq('id', id);
  if (error) {
    console.error("Erro deleteNews:", error);
    throw error;
  }
};

export const DEFAULT_STATS: CityIndicator[] = [
  {
    id: '1',
    label: 'Vagas em Creches',
    value: '4.500',
    suffix: 'vagas',
    trend: 'up',
    category: Category.EDUCATION,
    color: 'blue',
    description: 'Total de novas vagas abertas na rede municipal de ensino infantil.'
  },
  {
    id: '2',
    label: 'Saúde da Família',
    value: '92',
    suffix: '%',
    trend: 'up',
    category: Category.HEALTH,
    color: 'emerald',
    description: 'Cobertura vacinal e atendimentos preventivos nas UBSs.'
  }
];

// --- Indicadores ---
export const fetchStats = async (): Promise<CityIndicator[]> => {
  try {
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error("Erro Supabase fetchStats:", error);
      return DEFAULT_STATS;
    }
    
    if (!data || data.length === 0) {
      console.log("Nenhum indicador no banco, usando DEFAULT_STATS");
      return DEFAULT_STATS;
    }
    
    return data;
  } catch (err) {
    console.error("Falha na rede fetchStats:", err);
    return DEFAULT_STATS;
  }
};

export const saveStat = async (stat: CityIndicator) => {
  const { id, projects, ...statData } = stat;
  
  try {
    if (id.startsWith('temp-')) {
      const { error } = await supabase.from('stats').insert([statData]);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('stats').upsert([{ id, ...statData }]);
      if (error) throw error;
    }
  } catch (err) {
    console.error("Erro saveStat:", err);
    throw err;
  }
};

export const deleteStat = async (id: string) => {
  const { error } = await supabase.from('stats').delete().eq('id', id);
  if (error) {
    console.error("Erro deleteStat:", error);
    throw error;
  }
};

// --- Banner ---
export const fetchBannerConfig = async (): Promise<BannerConfig> => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .single();
    
    if (error || !data) {
      if (error && error.code !== 'PGRST116') console.error("Erro Supabase fetchBannerConfig:", error);
      return DEFAULT_BANNER;
    }
    return data;
  } catch (err) {
    console.error("Falha na rede fetchBannerConfig:", err);
    return DEFAULT_BANNER;
  }
};

export const saveBannerConfig = async (config: BannerConfig) => {
  const { error } = await supabase.from('banners').upsert([{ id: 1, ...config }]);
  if (error) {
    console.error("Erro saveBannerConfig:", error);
    throw error;
  }
};

// --- Configuração Global ---
export const fetchGlobalConfig = async (): Promise<GlobalConfig> => {
  try {
    const { data, error } = await supabase
      .from('config')
      .select('*')
      .single();
    
    if (error || !data) {
      if (error && error.code !== 'PGRST116') console.error("Erro Supabase fetchGlobalConfig:", error);
      return DEFAULT_CONFIG;
    }
    return data;
  } catch (err) {
    console.error("Falha na rede fetchGlobalConfig:", err);
    return DEFAULT_CONFIG;
  }
};

export const saveGlobalConfig = async (config: GlobalConfig) => {
  const { error } = await supabase.from('config').upsert([{ id: 1, ...config }]);
  if (error) {
    console.error("Erro saveGlobalConfig:", error);
    throw error;
  }
};

// --- Impostômetro ---
export const fetchTaxConfig = async (): Promise<TaxConfig> => {
  try {
    const { data, error } = await supabase
      .from('tax_config')
      .select('*')
      .single();
    
    if (error || !data) {
      if (error && error.code !== 'PGRST116') console.error("Erro Supabase fetchTaxConfig:", error);
      return DEFAULT_TAX_CONFIG;
    }
    return data;
  } catch (err) {
    console.error("Falha na rede fetchTaxConfig:", err);
    return DEFAULT_TAX_CONFIG;
  }
};

export const saveTaxConfig = async (config: TaxConfig) => {
  const { error } = await supabase.from('tax_config').upsert([{ id: 1, ...config }]);
  if (error) {
    console.error("Erro saveTaxConfig:", error);
    throw error;
  }
};
