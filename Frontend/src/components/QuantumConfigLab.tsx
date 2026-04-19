
import React, { useState, useEffect, useMemo } from 'react';
import { ElementData } from '../types/types';

interface OrbitalState {
  id: string;
  electrons: number[]; // 1 for spin up, -1 for spin down
  capacity: number;
  energy: number;
}

const ORBITAL_LAYOUT = [
  { id: '1s', boxes: 1, energy: 1 },
  { id: '2s', boxes: 1, energy: 2 },
  { id: '2p', boxes: 3, energy: 3 },
  { id: '3s', boxes: 1, energy: 4 },
  { id: '3p', boxes: 3, energy: 5 },
  { id: '4s', boxes: 1, energy: 6 },
  { id: '3d', boxes: 5, energy: 7 },
  { id: '4p', boxes: 3, energy: 8 },
  { id: '5s', boxes: 1, energy: 9 },
  { id: '4d', boxes: 5, energy: 10 },
  { id: '5p', boxes: 3, energy: 11 },
  { id: '6s', boxes: 1, energy: 12 },
  { id: '4f', boxes: 7, energy: 13 },
  { id: '5d', boxes: 5, energy: 14 },
  { id: '6p', boxes: 3, energy: 15 },
  { id: '7s', boxes: 1, energy: 16 },
  { id: '5f', boxes: 7, energy: 17 },
  { id: '6d', boxes: 5, energy: 18 },
  { id: '7p', boxes: 3, energy: 19 },
];

interface QuantumConfigLabProps {
  element: ElementData;
}

const QuantumConfigLab: React.FC<QuantumConfigLabProps> = ({ element }) => {
  // orbitalId-boxIndex -> [spin, spin]
  const [userConfig, setUserConfig] = useState<Record<string, number[]>>({});
  const [violations, setViolations] = useState<string[]>([]);

  // Calculate total electrons placed
  const totalElectrons = useMemo(() => {
    // Fix: Explicitly type reduce as <number> to avoid "unknown" accumulator type errors
    // when using Object.values in some environments.
    return Object.values(userConfig).reduce<number>((acc, curr) => acc + (curr as number[]).length, 0);
  }, [userConfig]);

  // Check Rules
  useEffect(() => {
    const newViolations: string[] = [];
    
    // 1. Aufbau Check: Are lower energy levels full before filling higher ones?
    let prevFull = true;
    for (const level of ORBITAL_LAYOUT) {
      // Explicitly cast Object.entries to ensure spins is recognized as number[]
      const levelElectrons = (Object.entries(userConfig) as [string, number[]][])
        .filter(([key]) => key.startsWith(level.id))
        .reduce((acc, [_, spins]) => acc + (spins as number[]).length, 0);
      
      const maxCapacity = level.boxes * 2;
      
      if (levelElectrons > 0 && !prevFull) {
        newViolations.push(`Aufbau Violation: ${level.id} started before lower levels filled.`);
      }
      
      if (levelElectrons < maxCapacity) prevFull = false;
    }

    // 2. Hund's Rule: Degenerate orbitals must have parallel spins before pairing
    ORBITAL_LAYOUT.filter(l => l.boxes > 1).forEach(level => {
      const subshellBoxes = Array.from({ length: level.boxes }).map((_, i) => userConfig[`${level.id}-${i}`] || []);
      // Explicitly cast subshellBoxes to ensure b is recognized as number[]
      const totalInSubshell = (subshellBoxes as number[][]).reduce((acc, b) => acc + (b as number[]).length, 0);
      
      if (totalInSubshell > 1 && totalInSubshell <= level.boxes) {
        // Should all be single if total <= boxes
        const hasPairs = subshellBoxes.some(b => b.length > 1);
        if (hasPairs) {
          newViolations.push(`Hund's Violation in ${level.id}: Orbitals must be singly occupied first.`);
        }
        // Should all have same spin
        const spins = subshellBoxes.flat();
        if (new Set(spins).size > 1) {
          newViolations.push(`Hund's Violation in ${level.id}: Single electrons must have parallel spins.`);
        }
      }
    });

    setViolations(newViolations);
  }, [userConfig]);

  const handleBoxClick = (orbId: string, boxIdx: number) => {
    const key = `${orbId}-${boxIdx}`;
    const current = userConfig[key] || [];
    
    let next: number[] = [];
    if (current.length === 0) next = [1]; // Add spin up
    else if (current.length === 1 && current[0] === 1) next = [1, -1]; // Add spin down
    else if (current.length === 1 && current[0] === -1) next = [1, -1]; // Alternative
    else next = []; // Remove all

    setUserConfig(prev => ({ ...prev, [key]: next }));
  };

  const autoFill = () => {
    const newConfig: Record<string, number[]> = {};
    let remaining = element.number;

    for (const level of ORBITAL_LAYOUT) {
      if (remaining <= 0) break;
      
      const toFill = Math.min(remaining, level.boxes * 2);
      remaining -= toFill;

      // Logic to fill according to rules
      for (let i = 0; i < toFill; i++) {
        const boxIdx = i % level.boxes;
        const key = `${level.id}-${boxIdx}`;
        if (!newConfig[key]) newConfig[key] = [];
        
        if (i < level.boxes) newConfig[key].push(1); // First pass: Up
        else newConfig[key].push(-1); // Second pass: Down
      }
    }
    setUserConfig(newConfig);
  };

  const reset = () => setUserConfig({});

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="glass-panel p-10 rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none font-black text-9xl uppercase select-none">
          Quantum
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Electronic Configuration Lab</h4>
            <h2 className="text-4xl font-black text-white tracking-tight">Orbital Box Simulation</h2>
            <p className="text-white/40 text-sm mt-2 max-w-xl">
              Manually place electrons to explore the fundamental principles of quantum mechanics. Achieve the target <span className="text-indigo-400 font-bold">Z={element.number}</span> for {element.name}.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={autoFill}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20"
            >
              Ground State Auto-Fill
            </button>
            <button 
              onClick={reset}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Reset Lab
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Target Atomic Number</p>
            <p className="text-3xl font-black text-white">{element.number}</p>
          </div>
          <div className={`p-6 rounded-3xl border transition-all ${totalElectrons === element.number ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5'}`}>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Electrons Placed</p>
            <p className={`text-3xl font-black ${totalElectrons > element.number ? 'text-red-500' : 'text-indigo-400'}`}>
              {totalElectrons}
            </p>
          </div>
          <div className={`p-6 rounded-3xl border transition-all ${violations.length > 0 ? 'bg-red-500/10 border-red-500/30 animate-pulse' : 'bg-white/5 border-white/5'}`}>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Rule Status</p>
            <p className={`text-xs font-bold uppercase tracking-wide ${violations.length > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
              {violations.length > 0 ? `${violations.length} Violation(s) Detected` : 'All Principles Satisfied'}
            </p>
          </div>
        </div>

        {/* Violations Display */}
        {violations.length > 0 && (
          <div className="mb-10 p-6 bg-red-950/20 border border-red-500/20 rounded-[32px] space-y-2">
            {violations.map((v, i) => (
              <div key={i} className="flex items-center gap-3 text-red-400 text-xs font-bold">
                <i className="fas fa-exclamation-triangle"></i>
                {v}
              </div>
            ))}
          </div>
        )}

        {/* Interactive Grid */}
        <div className="flex flex-col-reverse gap-8 p-10 bg-slate-900/40 rounded-[40px] border border-white/5">
          {ORBITAL_LAYOUT.map((level) => {
            const isTarget = totalElectrons > 0 && Object.keys(userConfig).some(k => k.startsWith(level.id));
            
            return (
              <div key={level.id} className="flex items-center gap-10 group">
                <div className="w-16 flex flex-col items-center">
                  <span className={`text-xs font-black transition-colors ${isTarget ? 'text-indigo-400' : 'text-white/20'}`}>
                    {level.id.toUpperCase()}
                  </span>
                  <div className="w-1 h-4 bg-white/5 rounded-full mt-1"></div>
                </div>

                <div className="flex gap-3">
                  {Array.from({ length: level.boxes }).map((_, i) => {
                    const spins = userConfig[`${level.id}-${i}`] || [];
                    return (
                      <button
                        key={i}
                        onClick={() => handleBoxClick(level.id, i)}
                        className={`
                          w-14 h-14 rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 relative
                          ${spins.length > 0 
                            ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                          }
                        `}
                      >
                        {spins.includes(1) && (
                          <div className="text-xl font-black text-indigo-400 animate-in slide-in-from-bottom-2">↑</div>
                        )}
                        {spins.includes(-1) && (
                          <div className="text-xl font-black text-indigo-200 animate-in slide-in-from-top-2">↓</div>
                        )}
                        
                        {/* Hover hint */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                           {spins.length === 0 && <span className="text-[8px] text-white/10">ADD</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Subshell Count */}
                <div className="ml-auto text-[10px] font-mono text-white/10 font-black">
                   CAPACITY: {level.boxes * 2}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Config String */}
        <div className="mt-12 p-8 bg-slate-950 rounded-[32px] border border-white/5 overflow-x-auto whitespace-nowrap">
           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-6">Computed Configuration:</span>
           <div className="inline-flex gap-4">
             {ORBITAL_LAYOUT.map(level => {
               // Explicitly cast Object.entries to ensure spins is recognized as number[]
               const count = (Object.entries(userConfig) as [string, number[]][])
                 .filter(([key]) => key.startsWith(level.id))
                 .reduce((acc, [_, spins]) => acc + (spins as number[]).length, 0);
               
               if (count === 0) return null;
               return (
                 <div key={level.id} className="flex items-baseline">
                   <span className="text-xl font-black text-white">{level.id}</span>
                   <sup className="text-sm font-black text-indigo-400">{count}</sup>
                 </div>
               );
             })}
             {totalElectrons === 0 && <span className="text-xl font-black text-white/10 italic">Awaiting Electrons...</span>}
           </div>
        </div>
      </div>

      {/* Lab Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <TheoryCard 
          icon="fa-arrow-up" 
          title="Aufbau Principle" 
          desc="Electrons fill subshells of the lowest available energy first (e.g. 1s before 2s)." 
         />
         <TheoryCard 
          icon="fa-arrows-alt-v" 
          title="Pauli Principle" 
          desc="An orbital can hold at most two electrons, and they must have opposite spins." 
         />
         <TheoryCard 
          icon="fa-layer-group" 
          title="Hund's Rule" 
          desc="Every orbital in a subshell is singly occupied with one electron before any orbital is doubly occupied." 
         />
      </div>
    </div>
  );
};

const TheoryCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="glass-panel p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg">
      <i className={`fas ${icon} text-white`}></i>
    </div>
    <h4 className="text-lg font-black text-white mb-2">{title}</h4>
    <p className="text-xs text-white/40 leading-relaxed font-medium uppercase tracking-wider">{desc}</p>
  </div>
);

export default QuantumConfigLab;
