import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, MessageSquare, X, Settings, Eye, Moon, Sun, Languages, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AtomVisualizer from './components/AtomicVisualizer';
import PeriodicTable from './components/PeriodicTable';
import AufbauChart from './components/AufbauChart';
import TrendsVisualizer from './components/TrendsVisualizer';
import ElementComparison from './components/ElementComparison';
import BondingLab from './components/BondingLab';
import GeometryLab from './components/GeometryLab';
import HistoricalModels from './components/HistoricalModels';
import QuantumConfigLab from './components/QuantumConfigLab';
import QuantumNumbersLab from './components/QuantumNumbersLab';

import MechanicsVisualizer from './components/MechanicsVisualizer';
import ElectromagnetismVisualizer from './components/ElectromagnetismVisualizer';

import MicrobiologyLab from './components/MicrobiologyLab';
import CellBiologyLab from './components/CellBiologyLab';

import VectorCalculusLab from './components/VectorCalculusLab';
import PiVisualizationLab from './components/PiVisualizationLab';
import ComplexNumbersLab from './components/ComplexNumbersLab';
import PythagorasLab from './components/PythagorasLab';


import LandingPage from './components/LandingPage';
import SubjectPage from './components/SubjectPage';
import TopicPage from './components/TopicPage';
import TeacherDashboard from './components/TeacherDashboard';
import InstituteDashboard from './components/InstituteDashboard';
import GestureController from './components/GestureController';
import BottomNav from './components/BottomNav';
import Glossary from './components/Glossary';
import AuthOverlay from './components/AuthOverlay';
import AuthPage from './components/AuthPage';

import QuizPage from './components/Quiz';
import { generateQuizAI } from './data/quizData';

import { ELEMENTS } from './utils/constants';
import { ElementData, Subject, Topic, ViewState, TopicId } from './types/types';
import { Language, translations } from './services/translations';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getElements } from './services/elementsService';


import StandardSelection from './components/StandardSelection';
import AppLayout from './components/AppLayout';

const AppContent: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  const [elements, setElements] = useState<ElementData[]>(ELEMENTS);
  const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS[0]);

  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const [isGestureActive, setIsGestureActive] = useState(false);
  const [atomRotation, setAtomRotation] = useState({ dx: 0, dy: 0 });
  const [atomZoom, setAtomZoom] = useState(1);
  const [moleculeRotation, setMoleculeRotation] = useState({ dx: 0, dy: 0 });
  const [moleculeZoom, setMoleculeZoom] = useState(1);
  const [gesturePos, setGesturePos] = useState<{ x: number; y: number } | null>(null);

  // ================= QUIZ =================
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLevel, setQuizLevel] = useState<'basic' | 'intermediate' | 'difficult'>('basic');

  // ================= FETCH =================
  useEffect(() => {
    getElements()
      .then((data) => {
        if (data?.length) {
          setElements(data);
          setSelectedElement(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  // ================= THEME =================
  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('colorblind-mode', colorBlindMode);
  }, [colorBlindMode]);

  const t = (key: string) => translations[key]?.[language] || key;

  // ================= NAVIGATION =================
  const handleSelectClass = useCallback((className: string) => {
    setSelectedClass(className);
    setViewState(ViewState.CLASS_SUBJECTS);
  }, []);

  const handleSelectSubject = useCallback((subject: Subject) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setSelectedSubject(subject);
    setViewState(ViewState.SUBJECT);
  }, [user]);


  const handleSelectTopic = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setViewState(ViewState.TOPIC);
  }, []);

  const handleBack = () => {
    switch (viewState) {
      case ViewState.TOPIC: setViewState(ViewState.SUBJECT); break;
      case ViewState.SUBJECT: setViewState(ViewState.CLASS_SUBJECTS); break;
      case ViewState.CLASS_SUBJECTS: setViewState(ViewState.LANDING); break;
      case ViewState.DASHBOARD: setViewState(ViewState.LANDING); break;
      default: setViewState(ViewState.LANDING);
    }
  };

  const handleGoHome = () => {
    setViewState(ViewState.LANDING);
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
  };

  // ================= QUIZ =================
  const startQuiz = () => {
    if (!selectedSubject) return;
    const generated = generateQuizAI(selectedSubject.name, quizLevel);
    if (!generated || generated.length === 0) {
      alert("Quiz generation failed");
      return;
    }
    setQuizQuestions(generated);
    setShowQuiz(true);
  };

  // ================= VISUALIZATION =================
  const renderVisualization = useCallback((topicId: TopicId) => {
    switch (topicId) {
      case TopicId.ATOMIC_STRUCTURE:
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-[3] relative min-h-[300px]">
              <AtomVisualizer
                element={selectedElement}
                rotation={atomRotation}
                zoom={atomZoom}
              />
            </div>
            <div className="flex-[2] border-t border-white/5 overflow-y-auto bg-black/40">
              <PeriodicTable
                elements={elements}
                onSelect={setSelectedElement}
                selectedSymbol={selectedElement.symbol}
              />
            </div>
          </div>
        );

      case TopicId.QUANTUM_CONFIG:
        return (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-black/40 border-b border-white/5">
              <PeriodicTable
                elements={elements}
                onSelect={setSelectedElement}
                selectedSymbol={selectedElement.symbol}
              />
            </div>
            <div className="flex-[2] p-8 grid xl:grid-cols-4 gap-8 min-h-0 overflow-y-auto">
              <div className="xl:col-span-3">
                <QuantumConfigLab element={selectedElement} />
              </div>
              <div className="h-full min-h-[400px]">
                <AufbauChart atomicNumber={selectedElement.number} />
              </div>
            </div>
          </div>
        );

      case TopicId.PERIODIC_TRENDS:
        return (
          <div className="h-full overflow-y-auto p-4 md:p-8 space-y-12">
            <TrendsVisualizer />
            <ElementComparison />
          </div>
        );

      case TopicId.MOLECULAR_STRUCTURE:
        return (
          <div className="h-full overflow-y-auto p-4 md:p-8 space-y-12">
            <BondingLab />
            <GeometryLab rotation={moleculeRotation} zoom={moleculeZoom} />
          </div>
        );

      case TopicId.QUANTUM_NUMBERS: return <QuantumNumbersLab />;
      case TopicId.HISTORICAL_MODELS: return <HistoricalModels />;
      case TopicId.MECHANICS: return <div className="p-8"><MechanicsVisualizer /></div>;
      case TopicId.ELECTROMAGNETISM: return <div className="p-8"><ElectromagnetismVisualizer /></div>;
      case TopicId.MICROBIOLOGY: return <div className="p-8"><MicrobiologyLab /></div>;
      case TopicId.CELL_BIOLOGY: return <div className="p-8"><CellBiologyLab /></div>;
      case TopicId.VECTOR_CALCULUS: return <div className="p-8"><VectorCalculusLab/></div>;
      case TopicId.PI_APPROXIMATION: return <div className="p-8"><PiVisualizationLab/></div>;
      case TopicId.COMPLEX_NUMBERS: return <div className="p-8"><ComplexNumbersLab /></div>;
      case TopicId.PYTHAGORAS_THEOREM: return <div className="p-8"><PythagorasLab /></div>;
      default: return <div className="p-10 text-center">Coming Soon</div>;
    }
  }, [elements, selectedElement, atomRotation, moleculeRotation, atomZoom]);

  const handleGestureBack = () => handleBack();

  const handleGestureScroll = (delta: number) => {
    const scrollable = document.querySelector('.overflow-y-auto');
    if (scrollable) scrollable.scrollBy({ top: delta, behavior: 'smooth' });
    else window.scrollBy({ top: delta, behavior: 'smooth' });
  };

  const handleGestureRotate = (dx: number, dy: number) => {
    if (selectedTopic?.id === TopicId.MOLECULAR_STRUCTURE) {
      setMoleculeRotation({ dx, dy });
      setTimeout(() => setMoleculeRotation({ dx: 0, dy: 0 }), 50);
    } else {
      setAtomRotation({ dx, dy });
      setTimeout(() => setAtomRotation({ dx: 0, dy: 0 }), 50);
    }
  };

  const handleGestureZoom = (delta: number) => {
    const setter = selectedTopic?.id === TopicId.MOLECULAR_STRUCTURE ? setMoleculeZoom : setAtomZoom;
    setter((prev) => Math.min(1.8, Math.max(0.7, prev + delta * 0.00012)));
  };

  const handleResetZoom = useCallback(() => {
    setMoleculeZoom(1);
    setAtomZoom(1);
  }, []);

  if (isLoading) return null;

  const getPageConfig = () => {
    switch (viewState) {
      case ViewState.CLASS_SUBJECTS: return { title: selectedClass || 'Curriculum', subtitle: 'Subjects' };
      case ViewState.SUBJECT: return { title: selectedSubject?.name, subtitle: selectedClass || 'Subject' };
      case ViewState.TOPIC: return { title: selectedTopic?.name, subtitle: selectedSubject?.name };
      case ViewState.DASHBOARD: return { title: 'Dashboard', subtitle: user?.role === 'teacher' ? 'Teacher' : 'Institute' };
      default: return { title: '', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageConfig();

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden ${colorBlindMode ? 'colorblind-mode' : ''}`}>
      <AppLayout 
        currentView={viewState}
        onBack={handleBack}
        onHome={handleGoHome}
        title={title}
        subtitle={subtitle}
        user={user}
      >
        <AnimatePresence mode="wait">
          {viewState === ViewState.LANDING && (
            <StandardSelection onSelectClass={handleSelectClass} />
          )}

          {viewState === ViewState.CLASS_SUBJECTS && (
            <LandingPage 
              onSelectSubject={handleSelectSubject} 
              language={language} 
              user={user}
              selectedClass={selectedClass}
              onLoginClick={() => setShowAuth(true)}
              onLogoutClick={logout}
              onProfileClick={() => setShowAuth(true)}
              onOpenGlossary={() => setShowGlossary(true)}
            />
          )}

          {viewState === ViewState.SUBJECT && selectedSubject && (
            <SubjectPage
              subject={selectedSubject}
              onSelectTopic={handleSelectTopic}
              onBack={() => setViewState(ViewState.CLASS_SUBJECTS)}
              language={language}
              onStartQuiz={startQuiz}
              quizLevel={quizLevel}
              onLevelChange={setQuizLevel}
              selectedClass={selectedClass}
            />
          )}

          {viewState === ViewState.TOPIC && selectedTopic && (
            <TopicPage
              topic={selectedTopic}
              onBack={() => setViewState(ViewState.SUBJECT)}
              visualization={renderVisualization(selectedTopic.id)}
              language={language}
              onStartQuiz={startQuiz}
            />
          )}

          {viewState === ViewState.DASHBOARD && user && (
            user.role === 'teacher' ? (
              <TeacherDashboard onBackToApp={() => setViewState(ViewState.LANDING)} />
            ) : (
              <InstituteDashboard onBackToApp={() => setViewState(ViewState.LANDING)} />
            )
          )}
        </AnimatePresence>
      </AppLayout>

      {/* Overlays */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200]">
            <QuizPage questions={quizQuestions} onExit={() => setShowQuiz(false)} />
          </motion.div>
        )}
        {showGlossary && <Glossary language={language} onClose={() => setShowGlossary(false)} />}
        {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} />}
      </AnimatePresence>

      {/* HUD components */}
      {!showQuiz && (
        <>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`fixed bottom-8 right-28 w-16 h-16 rounded-2xl hidden md:flex items-center justify-center transition-all duration-500 z-[110] ${
              showSettings ? 'bg-indigo-500 rotate-90 shadow-lg shadow-indigo-500/40' : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Settings size={24} className={showSettings ? 'text-white' : 'text-slate-400'} />
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-28 right-28 w-72 glass-panel p-6 rounded-3xl z-[110] border border-white/10 origin-bottom-right"
              >
                <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-indigo-400 mb-6 flex items-center gap-2">
                  <Eye size={12} /> {t('accessibility')}
                </h3>
                <div className="space-y-4">
                  <SettingItem label={t('colorblindMode')} onToggle={() => setColorBlindMode(!colorBlindMode)} active={colorBlindMode} />
                  <SettingItem label={t('theme')} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} active={theme === 'light'} icon={theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} />
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 block">{t('language')}</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['en', 'bn', 'hi'].map((lang) => (
                        <button key={lang} onClick={() => setLanguage(lang as Language)} className={`py-2 rounded-lg text-[10px] font-mono ${language === lang ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-500'}`}>{lang}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <BottomNav 
            currentView={viewState} onNavigate={setViewState}
            onOpenGlossary={() => setShowGlossary(!showGlossary)}
            onOpenSettings={() => setShowSettings(!showSettings)}
            onOpenProfile={() => setShowAuth(!showAuth)}
            onToggleGesture={() => { if (user?.role !== 'student') setIsGestureActive(!isGestureActive); }}
            isGestureActive={isGestureActive} showSettings={showSettings} showGlossary={showGlossary}
            showAuth={showAuth} language={language} user={user}
          />

          <GestureController 
            isActive={isGestureActive && user?.role !== 'student'}
            onToggle={() => { if (user?.role !== 'student') setIsGestureActive(!isGestureActive); }}
            onBack={handleGestureBack} onScroll={handleGestureScroll} onRotate={handleGestureRotate}
            onZoom={handleGestureZoom} onResetZoom={handleResetZoom} onPositionChange={setGesturePos}
            onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          />

          {isGestureActive && gesturePos && user?.role !== 'student' && (
            <motion.div 
              className="fixed w-8 h-8 rounded-full border-2 border-indigo-500 bg-indigo-500/20 pointer-events-none z-[200] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              animate={{ left: `${gesturePos.x * 100}%`, top: `${gesturePos.y * 100}%` }}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-1 h-1 bg-white rounded-full" />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

const SettingItem: React.FC<{ label: string, active: boolean, onToggle: () => void, icon?: React.ReactNode }> = ({ label, active, onToggle, icon }) => (
  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">{label}</span>
    <button onClick={onToggle} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-indigo-600 text-white shadow-lg border-none' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
      {icon ? icon : <div className={`w-3 h-3 rounded-full ${active ? 'bg-white' : 'bg-slate-500'}`} />}
    </button>
  </div>
);


const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
