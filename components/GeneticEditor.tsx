
import React, { useState } from 'react';
import { SpecimenCategory, CreationRequest, GeneticTraits } from '../types';
import { audioService } from '../services/audioService';
import { translations, Language } from '../translations';

interface GeneticEditorProps {
  onSynthesize: (request: CreationRequest) => void;
  isProcessing: boolean;
  lang: Language;
}

const GeneticEditor: React.FC<GeneticEditorProps> = ({ onSynthesize, isProcessing, lang }) => {
  const t = translations[lang];
  const [category, setCategory] = useState<SpecimenCategory>(SpecimenCategory.ANIMAL);
  const [baseIdea, setBaseIdea] = useState('');
  const [traits, setTraits] = useState<GeneticTraits>({
    habitat: lang === 'id' ? 'Hutan Hujan Tropis' : 'Tropical Rainforest',
    behavior: lang === 'id' ? 'Pemangsa' : 'Predatory',
    primaryColor: lang === 'id' ? 'Hijau Zamrud' : 'Emerald Green',
    size: 'Medium',
    stability: 85
  });

  const randomData = {
    ideas: {
      [SpecimenCategory.ANIMAL]: lang === 'id' ? [
        "Serigala bioluminescent dengan bulu merak",
        "Gurita darat raksasa yang menyerupai pohon",
        "Gajah kecil dengan sayap kupu-kupu transparan",
        "Hiu penggali yang berenang melalui pasir",
        "Pari manta melayang yang menyaring kabut asap"
      ] : [
        "A bioluminescent wolf with peacock feathers",
        "A giant land-dwelling octopus that mimics trees",
        "A tiny elephant with translucent butterfly wings",
        "A burrowing shark that swims through sand",
        "A hovering manta ray that filters smog"
      ],
      [SpecimenCategory.PLANT]: lang === 'id' ? [
        "Pohon yang menumbuhkan spora bercahaya melayang",
        "Tanaman merambat karnivora yang meniru bisikan manusia",
        "Kaktus yang menyimpan listrik cair",
        "Bunga seperti kaca yang memfokuskan cahaya matahari menjadi sinar",
        "Lumut bawah tanah yang berdenyut seperti detak jantung"
      ] : [
        "A tree that grows floating glowing spores",
        "A carnivorous vine that mimics human whispers",
        "A cactus that stores liquid electricity",
        "Glass-like flowers that focus sunlight into beams",
        "Subterranean moss that pulses like a heartbeat"
      ],
      [SpecimenCategory.FANTASY]: lang === 'id' ? [
        "Naga yang terbuat sepenuhnya dari kaca vulkanik hidup",
        "Rusa spektral yang meninggalkan jejak waktu beku",
        "Ular bersayap enam dengan mata seperti matahari zamrud",
        "Paus melayang yang membawa hutan di punggungnya",
        "Makhluk yang terbentuk dari statis murni dan bayangan"
      ] : [
        "A dragon made entirely of living volcanic glass",
        "A spectral stag that leaves trails of frozen time",
        "A six-winged serpent with eyes like emerald suns",
        "A floating whale that carries a forest on its back",
        "A creature formed from pure static and shadows"
      ],
      [SpecimenCategory.MICROBE]: lang === 'id' ? [
        "Bakteri yang mengubah limbah radioaktif menjadi emas",
        "Virus yang memberikan inangnya telepati sementara",
        "Jamur yang menciptakan struktur geometris kompleks",
        "Organisme nano yang memperbaiki kerusakan sel",
        "Plankton yang mengubah air laut menjadi nektar yang bisa diminum"
      ] : [
        "Bacteria that converts radioactive waste into gold",
        "A virus that gives its host temporary telepathy",
        "Fungi that creates complex geometric structures",
        "Nano-organisms that repair cellular damage",
        "Plankton that turns seawater into drinkable nectar"
      ],
      [SpecimenCategory.HYBRID]: lang === 'id' ? [
        "Lebah mekanis dengan jantung organik penghasil madu",
        "Hibrida pohon ek-ubur-ubur dengan daun penyengat",
        "Elang sibernetik dengan bulu sel surya",
        "Entitas krustasea-karang dengan sonar bawaan",
        "Serigala yang menyatu dengan pertumbuhan mineral kristal"
      ] : [
        "A mechanical bee with an organic honey-producing heart",
        "A jellyfish-oak tree hybrid with stinging leaves",
        "A cybernetic hawk with solar-cell plumage",
        "A coral-crustacean entity with built-in sonar",
        "A wolf fused with crystalline mineral growths"
      ]
    },
    habitats: lang === 'id' ? ["Nebula Melayang", "Gurun Obsidian", "Hutan Sibernetik", "Laut Metana Cair", "Katedral Kristal"] : ["Floating Nebula", "Obsidian Desert", "Cybernetic Jungle", "Liquid Methane Sea", "Crystal Cathedral"],
    behaviors: lang === 'id' ? ["Simbiosis", "Teritorial", "Nokturnal", "Telepati", "Hibernasi"] : ["Symbiotic", "Territorial", "Nocturnal", "Telepathic", "Hibernating"],
    colors: lang === 'id' ? ["Ultraviolet Neon", "Perak Chrome", "Hitam Abyssal", "Sian Bioluminescent", "Crimson Darah"] : ["Neon Ultraviolet", "Chrome Silver", "Abyssal Black", "Bioluminescent Cyan", "Blood Crimson"],
    sizes: ['Microscopic', 'Small', 'Medium', 'Large', 'Colossal'] as const
  };

  const handleRandomize = () => {
    audioService.playTick();
    const categories = Object.values(SpecimenCategory);
    const newCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryIdeas = randomData.ideas[newCategory];
    
    setCategory(newCategory);
    setBaseIdea(categoryIdeas[Math.floor(Math.random() * categoryIdeas.length)]);
    setTraits({
      habitat: randomData.habitats[Math.floor(Math.random() * randomData.habitats.length)],
      behavior: randomData.behaviors[Math.floor(Math.random() * randomData.behaviors.length)],
      primaryColor: randomData.colors[Math.floor(Math.random() * randomData.colors.length)],
      size: randomData.sizes[Math.floor(Math.random() * randomData.sizes.length)],
      stability: Math.floor(Math.random() * 60) + 40
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseIdea.trim()) return;
    onSynthesize({ category, baseIdea, traits });
  };

  return (
    <div className="glass-card p-6 rounded-2xl border-emerald-500/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-orbitron text-emerald-400 flex items-center gap-2">
          <i className="fas fa-dna"></i> {t.geneticSequencer}
        </h2>
        <button
          type="button"
          onClick={handleRandomize}
          className="text-[10px] font-orbitron bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
        >
          <i className="fas fa-dice"></i> {t.random}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.values(SpecimenCategory).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                audioService.playTick();
                setCategory(cat);
              }}
              className={`py-2 px-1 rounded-lg text-[10px] font-semibold transition-all ${
                category === cat 
                ? 'bg-emerald-600 text-white border-emerald-400 border shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">{t.bioConcept}</label>
          <textarea
            value={baseIdea}
            onChange={(e) => setBaseIdea(e.target.value)}
            placeholder={t.bioConceptPlaceholder}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none h-24 resize-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">{t.habitat}</label>
            <input
              type="text"
              value={traits.habitat}
              onChange={(e) => setTraits({ ...traits, habitat: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">{t.behavior}</label>
            <input
              type="text"
              value={traits.behavior}
              onChange={(e) => setTraits({ ...traits, behavior: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">{t.pigment}</label>
            <input
              type="text"
              value={traits.primaryColor}
              onChange={(e) => setTraits({ ...traits, primaryColor: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">{t.size}</label>
            <select
              value={traits.size}
              onChange={(e) => {
                audioService.playTick();
                setTraits({ ...traits, size: e.target.value as any });
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
            >
              <option value="Microscopic">Microscopic</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Colossal">Colossal</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">{t.stability}</span>
            <span className={traits.stability < 50 ? 'text-red-400' : 'text-emerald-400'}>{traits.stability}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={traits.stability}
            onInput={() => audioService.playTick()}
            onChange={(e) => setTraits({ ...traits, stability: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <button
          disabled={isProcessing || !baseIdea}
          className={`w-full py-4 rounded-xl font-orbitron font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            isProcessing 
            ? 'bg-slate-700 cursor-not-allowed text-slate-500' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
          }`}
        >
          {isProcessing ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i> {t.synthesizing}
            </>
          ) : (
            <>
              <i className="fas fa-flask"></i> {t.beginSynthesis}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default GeneticEditor;
