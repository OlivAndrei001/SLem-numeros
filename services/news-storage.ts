
import { Category, NewsArticle, CityIndicator, BannerConfig, GlobalConfig, TaxConfig } from '../types';
import { supabase } from './supabase';
import { MOCK_NEWS } from '../constants';

// Valores padrão para o caso de o banco estar vazio
const DEFAULT_TAX_CONFIG: TaxConfig = {
  title: 'Impostômetro São Leopoldo',
  description: 'Valores reais de arrecadação municipal extraídos diretamente dos portais de transparência oficiais.',
  lastUpdate: '26/02/2026',
  sectors: [
    { id: '1', name: 'ISS (Serviços)', dailyAverage: 0, baseValue: 154230450.22, color: 'blue' },
    { id: '2', name: 'IPTU (Propriedade)', dailyAverage: 0, baseValue: 92150840.15, color: 'emerald' },
    { id: '3', name: 'ICMS (Repasse RS)', dailyAverage: 0, baseValue: 228450120.40, color: 'amber' },
    { id: '4', name: 'FPM (Repasse União)', dailyAverage: 0, baseValue: 168320950.30, color: 'indigo' }
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
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .order('date', { ascending: false });
  
  if (error || !data || data.length === 0) return MOCK_NEWS;
  return data;
};

export const saveNews = async (news: NewsArticle) => {
  // Remove id if it's a new entry to let Supabase generate UUID
  const { id, ...newsData } = news;
  const dataToSave = id.startsWith('temp-') ? newsData : news;
  const { error } = await supabase.from('noticias').insert([dataToSave]);
  if (error) throw error;
};

export const deleteNews = async (id: string) => {
  const { error } = await supabase.from('noticias').delete().eq('id', id);
  if (error) throw error;
};

const DEFAULT_STATS: CityIndicator[] = [
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
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('id', { ascending: true });
  
  if (error || !data || data.length === 0) return DEFAULT_STATS;
  return data;
};

export const saveStat = async (stat: CityIndicator) => {
  // Remove id if it's a new entry to let Supabase generate UUID
  const { id, ...statData } = stat;
  const dataToSave = id.startsWith('temp-') ? statData : stat;
  const { error } = await supabase.from('stats').upsert([dataToSave]);
  if (error) throw error;
};

export const deleteStat = async (id: string) => {
  const { error } = await supabase.from('stats').delete().eq('id', id);
  if (error) throw error;
};

// --- Banner ---
export const fetchBannerConfig = async (): Promise<BannerConfig> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .single();
  
  if (error || !data) return DEFAULT_BANNER;
  return data;
};

export const saveBannerConfig = async (config: BannerConfig) => {
  // Assume que temos apenas um banner ativo
  const { error } = await supabase.from('banners').upsert([{ id: 1, ...config }]);
  if (error) throw error;
};

// --- Configuração Global ---
export const fetchGlobalConfig = async (): Promise<GlobalConfig> => {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .single();
  
  if (error || !data) return DEFAULT_CONFIG;
  return data;
};

export const saveGlobalConfig = async (config: GlobalConfig) => {
  const { error } = await supabase.from('config').upsert([{ id: 1, ...config }]);
  if (error) throw error;
};

// --- Impostômetro ---
export const fetchTaxConfig = async (): Promise<TaxConfig> => {
  const { data, error } = await supabase
    .from('tax_config')
    .select('*')
    .single();
  
  if (error || !data) return DEFAULT_TAX_CONFIG;
  return data;
};

export const saveTaxConfig = async (config: TaxConfig) => {
  const { error } = await supabase.from('tax_config').upsert([{ id: 1, ...config }]);
  if (error) throw error;
};
