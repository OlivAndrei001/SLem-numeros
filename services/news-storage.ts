
import { NewsArticle, CityIndicator, BannerConfig, GlobalConfig } from '../types';
import { supabase } from './supabase';
import { MOCK_NEWS } from '../constants';

// Valores padrão para o caso de o banco estar vazio
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

// --- Indicadores ---
export const fetchStats = async (): Promise<CityIndicator[]> => {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('id', { ascending: true });
  
  if (error || !data) return [];
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
