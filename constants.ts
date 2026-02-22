
import { Category, NewsArticle, CityStat } from './types';

export const COLORS = {
  primary: '#004a99', // Azul São Leopoldo
  secondary: '#d9262e', // Vermelho Institucional
  tertiary: '#2d8b44', // Verde Institucional
  accent: '#003366',
};

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Prefeitura anuncia novos investimentos em infraestrutura urbana para o segundo semestre',
    summary: 'O pacote de obras contempla a revitalização de 15 quilômetros de vias nos bairros Scharlau e Feitoria.',
    content: 'A Prefeitura de São Leopoldo anunciou nesta segunda-feira um novo pacote de investimentos que visa transformar a infraestrutura de mobilidade da cidade em 2026. Com um orçamento estimado em R$ 20 milhões, as obras focarão na drenagem pluvial e pavimentação asfáltica. Segundo o secretário de obras, o projeto deve começar no próximo mês e gerar mais de 200 empregos diretos.',
    date: '2026-05-20',
    imageurl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    category: Category.ADMINISTRATION,
    author: 'Secretaria de Comunicação'
  },
  {
    id: '2',
    title: 'Campanha de Vacinação 2026: Influenza e Covid são prorrogadas',
    summary: 'Moradores podem procurar os postos de saúde até o final do mês para garantir a imunização anual.',
    content: 'Devido à baixa adesão em alguns grupos prioritários, a Secretaria Municipal de Saúde decidiu estender a campanha de vacinação. Todas as Unidades Básicas de Saúde (UBS) estarão abertas das 8h às 17h.',
    date: '2026-05-18',
    imageurl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    category: Category.HEALTH,
    author: 'Departamento de Vigilância em Saúde'
  },
  {
    id: '3',
    title: 'Proteção Animal: Balanço do primeiro semestre de 2026 supera metas',
    summary: 'Ação já realizou mais de 5.000 castrações gratuitas em diversos bairros este ano.',
    content: 'A Secretaria de Proteção Animal de São Leopoldo (SEMPA) iniciou hoje mais uma etapa do mutirão de castração gratuita. O foco são animais de famílias cadastradas no CadÚnico.',
    date: '2026-05-15',
    imageurl: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&q=80&w=800',
    category: Category.SOCIAL,
    author: 'SEMPA'
  }
];

export const CITY_STATS: CityStat[] = [
  { label: 'População Estimada', value: '242.180', trend: 'up', icon: '👥' },
  { label: 'PIB per Capita', value: 'R$ 48.920', trend: 'up', icon: '💰' },
  { label: 'IDEB (Anos Iniciais)', value: '6.4', trend: 'up', icon: '📚' },
  { label: 'Área Territorial', value: '102,7 km²', trend: 'stable', icon: '🗺️' },
];
