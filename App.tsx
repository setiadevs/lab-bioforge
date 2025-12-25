
import React, { useState, useEffect } from 'react';
import GeneticEditor from './components/GeneticEditor';
import SpecimenDisplay from './components/SpecimenDisplay';
import { SpecimenProfile, CreationRequest } from './types';
import { generateSpecimenData, generateSpecimenImage } from './services/geminiService';
import { audioService } from './services/audioService';
import { translations, Language } from './translations';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('bioforge_lang');
    return (saved as Language) || 'en';
  });
  
  const t = translations[lang];
  const [specimens, setSpecimens] = useState<SpecimenProfile[]>([]);
  const [activeSpecimen, setActiveSpecimen] = useState<SpecimenProfile | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('bioforge_lang', lang);
  }, [lang]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('bioforge_archive');
    if (saved) {
      try {
        setSpecimens(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load archive", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('bioforge_archive', JSON.stringify(specimens));
  }, [specimens]);

  const toggleLanguage = () => {
    audioService.playTick();
    setLang(prev => prev === 'en' ? 'id' : 'en');
  };

  const handleSynthesize = async (request: CreationRequest) => {
    setIsSynthesizing(true);
    audioService.playBlip();
    setError(null);
    try {
      const data = await generateSpecimenData(request, lang);
      const imageUrl = await generateSpecimenImage(data, request);
      
      const newSpecimen: SpecimenProfile = {
        id: crypto.randomUUID(),
        name: data.name!,
        scientificName: data.scientificName!,
        category: request.category,
        description: data.description!,
        taxonomy: data.taxonomy!,
        uniqueAbilities: data.uniqueAbilities!,
        habitatDetail: data.habitatDetail!,
        diet: data.diet!,
        lifespan: data.lifespan!,
        imageUrl: imageUrl,
        timestamp: Date.now()
      };

      setSpecimens(prev => [newSpecimen, ...prev]);
      setActiveSpecimen(newSpecimen);
      audioService.playSynthesized();
    } catch (err: any) {
      console.error(err);
      setError(t.error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const removeSpecimen = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playDelete();
    setSpecimens(prev => prev.filter(s => s.id !== id));
  };

  const viewSpecimen = (specimen: SpecimenProfile) => {
    audioService.playBlip();
    setActiveSpecimen(specimen);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="scanline" />
      </div>

      <header className="relative z-10 px-6 py-6 border-b border-white/10 glass-card">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-400">
              <i className="fas fa-atom text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                {t.appTitle}
              </h1>
              <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase">{t.appSubtitle}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            <button 
              onClick={toggleLanguage}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-orbitron hover:border-emerald-500 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-language text-emerald-400"></i>
              {lang.toUpperCase()}
            </button>
            <div className="hidden sm:flex px-4 py-2 bg-slate-900/80 rounded-full border border-slate-700 items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-300">{t.systemStable}: 100%</span>
            </div>
            <div className="px-4 py-2 bg-slate-900/80 rounded-full border border-slate-700 flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-300">{t.archive}: {specimens.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 xl:w-1/4 space-y-6">
          <GeneticEditor 
            onSynthesize={handleSynthesize} 
            isProcessing={isSynthesizing}
            lang={lang}
          />
          
          {error && (
            <div className="p-4 bg-red-950/50 border border-red-500/50 rounded-xl text-red-200 text-xs flex gap-3 animate-bounce">
              <i className="fas fa-exclamation-triangle mt-1"></i>
              <p>{error}</p>
            </div>
          )}

          <div className="p-6 glass-card rounded-2xl border-slate-700/50">
            <h3 className="text-sm font-orbitron text-slate-400 mb-4 uppercase tracking-wider">{t.labManual}</h3>
            <ul className="space-y-3 text-[11px] text-slate-500 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">1.</span>
                {t.step1}
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">2.</span>
                {t.step2}
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">3.</span>
                {t.step3}
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:w-2/3 xl:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-orbitron text-white">{t.specimenArchive}</h2>
            <div className="text-[10px] text-slate-500">{t.sortedBy}</div>
          </div>

          {specimens.length === 0 ? (
            <div className="h-[400px] rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center text-slate-600 px-6">
              <i className="fas fa-microscope text-6xl mb-6 opacity-20"></i>
              <p className="font-orbitron tracking-widest text-sm uppercase">{t.noSpecimens}</p>
              <p className="text-xs mt-2 italic">{t.synthesizeFirst}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {specimens.map(specimen => (
                <div 
                  key={specimen.id}
                  onClick={() => viewSpecimen(specimen)}
                  className="group relative glass-card rounded-2xl overflow-hidden border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-xl"
                >
                  <div className="h-48 relative">
                    <img 
                      src={specimen.imageUrl} 
                      alt={specimen.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <button 
                      onClick={(e) => removeSpecimen(specimen.id, e)}
                      className="absolute top-2 right-2 p-2 bg-black/40 text-slate-400 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/80 text-white rounded-md uppercase tracking-widest">
                        {specimen.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-orbitron font-bold text-white truncate">{specimen.name}</h3>
                    <p className="text-xs text-emerald-400 italic mb-2 truncate opacity-80">{specimen.scientificName}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {specimen.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {activeSpecimen && (
        <SpecimenDisplay 
          specimen={activeSpecimen} 
          lang={lang}
          onClose={() => {
            audioService.playTick();
            setActiveSpecimen(null);
          }} 
        />
      )}

      {isSynthesizing && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-center px-4">
          <div className="relative mb-10">
             <div className="w-48 h-48 rounded-full border-4 border-emerald-500/20 animate-pulse" />
             <div className="absolute inset-0 flex items-center justify-center">
               <i className="fas fa-dna text-6xl text-emerald-400 animate-spin" style={{ animationDuration: '3s' }}></i>
             </div>
             <div className="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-2 animate-pulse uppercase px-4">{t.recombining}</h2>
          <p className="text-emerald-400 font-mono text-[11px] md:text-sm max-w-md px-6">
            {t.loadingText}
          </p>
          <div className="mt-8 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      <footer className="relative z-10 py-6 text-center text-slate-600 text-[10px] border-t border-white/5 bg-slate-950/50">
        &copy; 2024 BIOFORGE LABORATORIES - ALL SYNTHETIC LIFE RIGHTS RESERVED - POWERED BY GEMINI PROTOTYPE
      </footer>
    </div>
  );
};

export default App;
