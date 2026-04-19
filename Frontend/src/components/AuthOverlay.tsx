
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { UserRole } from '../types/types';
import { User, LogOut, GraduationCap, School, X, ArrowRight, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthOverlayProps {
  onClose: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ onClose }) => {
  const { user, login, logout } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    login(name, role);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Identity Terminal</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!user ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-2">Full Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-2">Select Access Level</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'student', label: 'Student', desc: 'Interact w/ simulations & tutor', icon: GraduationCap },
                      { id: 'teacher', label: 'Teacher', desc: 'Access classroom & resources', icon: School },
                      { id: 'institute', label: 'Institute', desc: 'System analytics & fleet mgmt', icon: Building2 },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id as UserRole)}
                        className={`p-5 rounded-3xl border transition-all text-left flex items-center gap-4 ${
                          role === r.id 
                            ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/10' 
                            : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${role === r.id ? 'bg-primary text-white' : 'bg-white/5 text-slate-500'}`}>
                          <r.icon size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold uppercase tracking-tight">{r.label}</div>
                          <div className="text-[10px] opacity-60 font-mono tracking-widest leading-none mt-1">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full h-16 rounded-2xl bg-primary text-white font-mono uppercase tracking-[.2em] hover:bg-primary/80 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/30"
                >
                  Authorize Access
                  <ArrowRight size={18} />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner relative">
                    <User size={48} />
                    <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-primary text-[8px] font-mono text-white tracking-widest uppercase border-4 border-slate-950">
                      Active Session
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">{user.name}</h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mb-6">{user.role}</p>
                  
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">System ID</span>
                      <span className="text-[10px] font-mono text-white opacity-80 uppercase">{user.id}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Sync Status</span>
                      <span className="text-[10px] font-mono text-emerald-500 uppercase flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all font-mono uppercase tracking-[.2em] flex items-center justify-center gap-3"
                >
                  <LogOut size={18} />
                  Terminate Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthOverlay;
