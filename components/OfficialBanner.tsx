
import React from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { BannerConfig } from '../types';

interface OfficialBannerProps {
  config: BannerConfig;
}

export const OfficialBanner: React.FC<OfficialBannerProps> = ({ config }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
      <div className="bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl group border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            <div className="inline-flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <BarChart3 size={14} className="text-blue-400" />
              <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-[0.3em]">Insight em Destaque</span>
            </div>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter">
              {config.title} <span className="text-blue-400">{config.highlight}</span>
            </h3>
            <p className="text-slate-400 text-base sm:text-lg font-medium leading-relaxed">
              {config.description}
            </p>
            <div className="pt-2 sm:pt-4">
              <a 
                href={config.link} 
                className="inline-flex items-center justify-center w-full sm:w-auto bg-white text-slate-900 px-10 py-4 rounded-xl sm:rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all group shadow-xl text-[10px] sm:text-xs uppercase tracking-widest"
              >
                {config.buttontext} <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] absolute inset-0 animate-pulse"></div>
            <div className="relative bg-white/5 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 scale-110 shadow-2xl">
              <div className="space-y-6">
                <div className="h-2 w-24 bg-blue-400 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-white/20 rounded-lg"></div>
                  <div className="h-4 w-32 bg-white/10 rounded-lg"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/30"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-white/20 rounded-full"></div>
                    <div className="h-3 w-12 bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      </div>
    </div>
  );
};
