
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { UserRole } from '../types/types';
import { 
  GraduationCap, 
  School, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Lock, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [instituteName, setInstituteName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In this mock, we just use name or institute name as the user name
    const finalName = selectedRole === 'institute' ? instituteName : name;
    if (!finalName) return;
    login(finalName, selectedRole);
  };

  const roles: { id: UserRole; label: string; icon: any; color: string; desc: string }[] = [
    { 
      id: 'student', 
      label: 'Student', 
      icon: GraduationCap, 
      color: 'text-blue-400', 
      desc: 'Join simulations, track progress, and learn with AI.' 
    },
    { 
      id: 'teacher', 
      label: 'Teacher', 
      icon: School, 
      color: 'text-indigo-400', 
      desc: 'Manage classrooms, upload resources, and guide students.' 
    },
    { 
      id: 'institute', 
      label: 'Teaching Institute', 
      icon: Building2, 
      color: 'text-emerald-400', 
      desc: 'Oversee multiple classes, analyze data, and manage faculty.' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-slate-950/50 backdrop-blur-3xl border border-white/10 rounded-[48px] overflow-hidden shadow-2xl"
      >
        {/* Left Side - Info Art */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')] mix-blend-overlay opacity-20 object-cover w-full h-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                <Sparkles size={24} />
              </div>
              <h1 className="text-2xl font-display font-bold uppercase tracking-tight italic">OMNI SCIENCE</h1>
            </div>
            
            <h2 className="text-5xl font-display font-bold leading-[0.9] uppercase italic mb-8">
              The Future of <br /> Interactive <br /> Learning.
            </h2>
            
            <div className="space-y-6">
              {[
                "Advanced 3D Scientific Simulations",
                "Real-time AI Tutoring & Analysis",
                "Cross-institutional Collaboration",
                "Mobile-First Offline Access"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80 font-mono text-[10px] uppercase tracking-widest">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12">
            <div className="p-6 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10">
              <p className="text-sm font-light italic text-white/90 leading-relaxed mb-4">
                "Our mission is to bring high-quality scientific laboratories to every corner of the globe, regardless of infrastructure."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20" />
                <div>
                  <div className="text-xs font-bold uppercase">Sayan Sinha</div>
                  <div className="text-[10px] text-white/50 uppercase font-mono">Lead Scientist, OmniScience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl w-fit mb-8 border border-white/5">
              <button 
                onClick={() => setIsLogin(true)}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-sm text-slate-500 font-light">
              {isLogin ? 'Enter your credentials to access the laboratory.' : 'Create a new account to begin your journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-3 py-4">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-2">Select Account Type</label>
              <div className="flex flex-col md:flex-row gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`flex-1 p-4 rounded-2xl border transition-all text-left group ${
                      selectedRole === r.id 
                        ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                        : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <r.icon size={20} className={`mb-3 ${selectedRole === r.id ? r.color : 'text-slate-600'}`} />
                    <div className="text-[10px] font-bold uppercase tracking-tight">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input 
                    type="text"
                    required
                    value={selectedRole === 'institute' ? instituteName : name}
                    onChange={(e) => selectedRole === 'institute' ? setInstituteName(e.target.value) : setName(e.target.value)}
                    placeholder={selectedRole === 'institute' ? "Institute Name" : "Full Name"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-light placeholder:text-slate-700"
                  />
                </div>
              )}
              
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-light placeholder:text-slate-700"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-light placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                  <div className="w-2 h-2 rounded-sm bg-indigo-500 opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Remember Me</span>
              </label>
              {isLogin && (
                <button type="button" className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </button>
              )}
            </div>

            <button 
              type="submit"
              className="w-full h-16 rounded-2xl bg-indigo-600 text-white font-mono uppercase tracking-[.2em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 group"
            >
              {isLogin ? 'Enter Laboratory' : 'Create Account'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center font-mono text-[9px] text-slate-600 uppercase tracking-widest pt-4">
              Authorized Access Only • System v1.4.2
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
