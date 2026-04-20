
import React from 'react';
import { Home, Book, User, Settings, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewState } from '../types/types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenGlossary: () => void;
  onOpenSettings: () => void;
  onOpenAITutor: () => void;
  onOpenProfile: () => void;
  language: string;
}

const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenGlossary,
  onOpenSettings,
  onOpenAITutor,
  onOpenProfile,
  language
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] px-4 pb-4 md:hidden">
      <div className="bg-[#020617]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => onNavigate(ViewState.LANDING)}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
            currentView === ViewState.LANDING ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home size={20} />
          <span className="text-[8px] font-mono mt-1">HOME</span>
        </button>

        <button 
          onClick={onOpenGlossary}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <Book size={20} />
          <span className="text-[8px] font-mono mt-1">BOOK</span>
        </button>

        <div className="relative -top-8">
          <button 
            onClick={onOpenAITutor}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 border-4 border-[#020617]"
          >
            <MessageSquare size={24} />
          </button>
        </div>

        <button 
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <User size={20} />
          <span className="text-[8px] font-mono mt-1">USER</span>
        </button>

        <button 
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={20} />
          <span className="text-[8px] font-mono mt-1">SET</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
