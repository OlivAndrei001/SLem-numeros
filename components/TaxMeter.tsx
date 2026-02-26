
import React, { useState, useEffect, useMemo } from 'react';
import { Coins, TrendingUp, Info, ArrowUpRight } from 'lucide-react';
import { TaxConfig, TaxSector } from '../types';

interface TaxMeterProps {
  config: TaxConfig;
}

const SectorCounter: React.FC<{ sector: TaxSector }> = ({ sector }) => {
  const [currentValue, setCurrentValue] = useState(sector.baseValue);

  useEffect(() => {
    // Calcula o valor por milissegundo baseado na média diária
    const msPerDay = 24 * 60 * 60 * 1000;
    const valuePerMs = sector.dailyAverage / msPerDay;
    
    // Define o valor inicial baseado no tempo decorrido hoje (ou desde o início do ano se baseValue for anual)
    // Para simplificar, vamos assumir que baseValue é o valor até o início do dia de hoje
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msElapsedToday = now.getTime() - startOfDay.getTime();
    
    const initialValue = sector.baseValue + (msElapsedToday * valuePerMs);
    setCurrentValue(initialValue);

    const interval = setInterval(() => {
      setCurrentValue(prev => prev + (valuePerMs * 100)); // Atualiza a cada 100ms
    }, 100);

    return () => clearInterval(interval);
  }, [sector]);

  const formattedValue = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(currentValue);
  }, [currentValue]);

  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100'
  };

  const activeColor = colorClasses[sector.color] || colorClasses.blue;

  return (
    <div className={`p-6 rounded-[2rem] border bg-white shadow-sm hover:shadow-md transition-all group`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${activeColor}`}>
          {sector.name}
        </span>
        <TrendingUp size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
      </div>
      <div className="space-y-1">
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter font-mono break-all">
          {formattedValue}
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Arrecadação Estimada</p>
      </div>
    </div>
  );
};

export const TaxMeter: React.FC<TaxMeterProps> = ({ config }) => {
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDailyAverage = config.sectors.reduce((acc, s) => acc + s.dailyAverage, 0);
    const totalBaseValue = config.sectors.reduce((acc, s) => acc + s.baseValue, 0);
    const valuePerMs = totalDailyAverage / msPerDay;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msElapsedToday = now.getTime() - startOfDay.getTime();
    
    const initialValue = totalBaseValue + (msElapsedToday * valuePerMs);
    setTotalValue(initialValue);

    const interval = setInterval(() => {
      setTotalValue(prev => prev + (valuePerMs * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [config]);

  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(totalValue);
  }, [totalValue]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="bg-slate-950 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Coins className="text-blue-400" size={20} />
                </div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Transparência Fiscal</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                {config.title}
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                {config.description}
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] w-full md:min-w-[300px]">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Total Arrecadado (Estimado)</p>
              <p className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter font-mono break-all">
                {formattedTotal}
              </p>
              <div className="mt-4 flex items-center text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                <Info size={12} className="mr-1 text-emerald-500" /> Atualizado em tempo real
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.sectors.map(sector => (
              <SectorCounter key={sector.id} sector={sector} />
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Fonte: Portais da Transparência Federal, Estadual e Municipal
            </p>
            <a 
              href="https://portaldatransparencia.gov.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors"
            >
              <span>Acessar Portal Oficial</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
