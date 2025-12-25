
import React from 'react';
import { SpecimenProfile } from '../types';
import { translations, Language } from '../translations';

interface SpecimenDisplayProps {
  specimen: SpecimenProfile;
  onClose: () => void;
  lang: Language;
}

const SpecimenDisplay: React.FC<SpecimenDisplayProps> = ({ specimen, onClose, lang }) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="glass-card max-w-5xl w-full rounded-3xl overflow-hidden shadow-2xl relative border-emerald-500/50">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          <div className="lg:w-1/2 relative min-h-[400px]">
            <img 
              src={specimen.imageUrl} 
              alt={specimen.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl font-orbitron font-bold text-white drop-shadow-lg">
                {specimen.name}
              </h1>
              <p className="text-emerald-400 italic text-lg font-medium opacity-90">
                {specimen.scientificName}
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 p-8 overflow-y-auto max-h-[80vh] lg:max-h-[90vh] custom-scrollbar">
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 text-emerald-500 mb-2 font-orbitron tracking-widest text-xs uppercase">
                  <i className="fas fa-microscope"></i> {t.classificationData}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">{t.domain}</div>
                    <div className="text-sm font-semibold">{specimen.category}</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">{t.lifespan}</div>
                    <div className="text-sm font-semibold">{specimen.lifespan}</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 col-span-2">
                    <div className="text-[10px] text-slate-500 uppercase">{t.taxonomy}</div>
                    <div className="text-sm font-mono opacity-80">{specimen.taxonomy}</div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 text-emerald-500 mb-2 font-orbitron tracking-widest text-xs uppercase">
                  <i className="fas fa-info-circle"></i> {t.bioProfile}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {specimen.description}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <div className="flex items-center gap-2 text-emerald-500 mb-2 font-orbitron tracking-widest text-xs uppercase">
                    <i className="fas fa-bolt"></i> {t.abilities}
                  </div>
                  <ul className="space-y-2">
                    {specimen.uniqueAbilities.map((ability, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                        {ability}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <div className="flex items-center gap-2 text-emerald-500 mb-2 font-orbitron tracking-widest text-xs uppercase">
                    <i className="fas fa-utensils"></i> {t.ecology}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase mb-1">{t.diet}</div>
                      <div className="text-xs text-slate-300">{specimen.diet}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase mb-1">{t.habitat}</div>
                      <div className="text-xs text-slate-300">{specimen.habitatDetail}</div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <div className="text-[10px] text-slate-500">SYNTHESIS_TIMESTAMP: {new Date(specimen.timestamp).toLocaleString()}</div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => window.print()} 
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <i className="fas fa-print mr-2"></i> {t.report}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecimenDisplay;
