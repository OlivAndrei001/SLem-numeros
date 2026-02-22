
export enum Category {
  ADMINISTRATION = 'administração',
  HEALTH = 'saúde',
  EDUCATION = 'educação',
  CULTURE = 'cultura',
  SPORT = 'esporte',
  SOCIAL = 'social',
  SAFETY = 'segurança',
  INFRASTRUCTURE = 'infraestrutura'
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  imageurl: string;
  category: Category;
  author: string;
}

export interface CityStat {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

export interface CityProject {
  id: string;
  name: string;
  description: string;
}

export interface CityIndicator {
  id: string;
  label: string;
  value: string;
  suffix: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  category: string;
  description?: string;
  projects?: CityProject[];
}

export interface BannerConfig {
  id?: number;
  title: string;
  highlight: string;
  description: string;
  buttontext: string;
  link: string;
}

export interface GlobalConfig {
  id?: number;
  logourl: string;
  cityname: string;
  cityslogan: string;
}
