
import React from 'react';

interface AufbauChartProps {
  atomicNumber: number;
}

const levels = [
  { id: '1s', capacity: 2, energy: 1 },
  { id: '2s', capacity: 2, energy: 2 },
  { id: '2p', capacity: 6, energy: 3 },
  { id: '3s', capacity: 2, energy: 4 },
  { id: '3p', capacity: 6, energy: 5 },
  { id: '4s', capacity: 2, energy: 6 },
  { id: '3d', capacity: 10, energy: 7 },
  { id: '4p', capacity: 6, energy: 8 },
  { id: '5s', capacity: 2, energy: 9 },
  { id: '4d', capacity: 10, energy: 10 },
  { id: '5p', capacity: 6, energy: 11 },
  { id: '6s', capacity: 2, energy: 12 },
  { id: '4f', capacity: 14, energy: 13 },
  { id: '5d', capacity: 10, energy: 14 },
  { id: '6p', capacity: 6, energy: 15 },
  { id: '7s', capacity: 2, energy: 16 },
  { id: '5f', capacity: 14, energy: 17 },
  { id: '6d', capacity: 10, energy: 18 },
  { id: '7p', capacity: 6, energy: 19 },
];

const AufbauChart: React.FC<AufbauChartProps> = ({ atomicNumber }) => {
  let remaining = atomicNumber;

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 h-full flex flex-col">
      <h4 className="text-xs font-bold text-white/40 uppercase mb-6 tracking-widest">Aufbau Energy Levels</h4>
      <div className="flex-1 flex flex-col-reverse justify-between gap-2">
        {levels.map((level) => {
          const filled = Math.min(level.capacity, remaining);
          remaining = Math.max(0, remaining - level.capacity);
          const percent = (filled / level.capacity) * 100;

          return (
            <div key={level.id} className="group relative">
              <div className="flex justify-between items-center mb-1 text-[10px] font-bold">
                <span className={filled > 0 ? "text-indigo-400" : "text-white/20"}>{level.id.toUpperCase()}</span>
                <span className="text-white/20">{filled} / {level.capacity}</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ width: `${percent}%` }}
                />
              </div>
              {/* Electron dots */}
              <div className="absolute -right-2 top-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {Array.from({ length: filled }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-white/5 rounded-2xl text-[11px] text-white/60 italic leading-relaxed">
        Electrons fill the lowest energy orbitals first before moving to higher levels.
      </div>
    </div>
  );
};

export default AufbauChart;
