import QuizPage from './components/Quiz';
import { generateQuizAI } from './data/quizData';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

import AtomVisualizer from './components/AtomicVisualizer';
import PeriodicTable from './components/PeriodicTable';
import TrendsVisualizer from './components/TrendsVisualizer';
import ElementComparison from './components/ElementComparison';
import BondingLab from './components/BondingLab';
import GeometryLab from './components/GeometryLab';
import HistoricalModels from './components/HistoricalModels';
import QuantumConfigLab from './components/QuantumConfigLab';
import QuantumNumbersLab from './components/QuantumNumbersLab';
import AufbauChart from './components/AufbauChart';

import LandingPage from './components/LandingPage';
import SubjectPage from './components/SubjectPage';
import TopicPage from './components/TopicPage';
import GestureController from './components/GestureController';

import { ElementData, Subject, Topic, ViewState, TopicId } from './types/types';
import { MessageSquare, X } from 'lucide-react';

import { Language, translations } from './services/translations';
import AuthPage from './components/AuthPage';
import { AuthProvider, useAuth } from './AuthContext';
import { ELEMENTS } from './utils/constants';

// ================= APP CONTENT =================
const AppContent: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();

  const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS[0]);
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const [showAITutor, setShowAITutor] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const [atomRotation, setAtomRotation] = useState({ dx: 0, dy: 0 });

  // ✅ QUIZ STATES
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLevel, setQuizLevel] = useState<'basic' | 'intermediate' | 'difficult'>('basic');

  const t = (key: string) => translations[key]?.[language] || key;

  // ================= SUBJECT FLOW =================
  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setViewState(ViewState.SUBJECT);
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setViewState(ViewState.TOPIC);
  };

  // ================= VISUALIZATION =================
  const renderVisualization = (topicId: TopicId) => {
    switch (topicId) {
      case TopicId.ATOMIC_STRUCTURE:
        return (
          <>
            <AtomVisualizer element={selectedElement} rotation={atomRotation} />
            <PeriodicTable
              elements={[]}
              onSelect={setSelectedElement}
              selectedSymbol={selectedElement.symbol}
            />
          </>
        );

      case TopicId.PERIODIC_TRENDS:
        return (
          <>
            <TrendsVisualizer />
            <ElementComparison />
          </>
        );

      case TopicId.MOLECULAR_STRUCTURE:
        return (
          <>
            <BondingLab />
            <GeometryLab />
          </>
        );

      case TopicId.QUANTUM_NUMBERS:
        return <QuantumNumbersLab />;

      case TopicId.HISTORICAL_MODELS:
        return <HistoricalModels />;

      case TopicId.QUANTUM_CONFIG:
        return (
          <>
            <QuantumConfigLab element={selectedElement} />
            <AufbauChart atomicNumber={selectedElement.number} />
          </>
        );

      default:
        return <div className="text-white p-10">Coming Soon</div>;
    }
  };

  // ================= QUIZ =================
  const startQuiz = () => {
    if (!selectedSubject) return;

    const generated = generateQuizAI(selectedSubject.name, quizLevel);

    if (!generated.length) {
      alert("Quiz generation failed");
      return;
    }

    setQuizQuestions(generated);
    setShowQuiz(true);
  };

  // ================= AUTH =================
  if (authLoading) return null;
  if (!user) return <AuthPage />;

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* QUIZ */}
      {showQuiz && (
        <QuizPage
          questions={quizQuestions}
          onExit={() => setShowQuiz(false)}
        />
      )}

      {!showQuiz && (
        <>
          <AnimatePresence mode="wait">

            {viewState === ViewState.LANDING && (
              <motion.div key="landing">
                <LandingPage onSelectSubject={handleSelectSubject} language={language} />
              </motion.div>
            )}

            {viewState === ViewState.SUBJECT && selectedSubject && (
              <motion.div key="subject">
                <SubjectPage
                  subject={selectedSubject}
                  onSelectTopic={handleSelectTopic}
                  onBack={() => setViewState(ViewState.LANDING)}
                  language={language}
                />

                {/* LEVEL SELECTOR */}
                <div className="fixed bottom-36 right-8 flex gap-2">
                  {["basic", "intermediate", "difficult"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setQuizLevel(lvl as any)}
                      className={`px-3 py-1 rounded ${
                        quizLevel === lvl ? "bg-indigo-600" : "bg-white/10"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                {/* START QUIZ */}
                <button
                  onClick={startQuiz}
                  className="fixed bottom-24 right-8 px-5 py-3 bg-green-600 rounded-xl hover:bg-green-700"
                >
                  Start Quiz
                </button>
              </motion.div>
            )}

            {viewState === ViewState.TOPIC && selectedTopic && (
              <motion.div key="topic">
                <TopicPage
                  topic={selectedTopic}
                  onBack={() => setViewState(ViewState.SUBJECT)}
                  visualization={renderVisualization(selectedTopic.id)}
                  language={language}
                />
              </motion.div>
            )}

          </AnimatePresence>

          {/* AI BUTTON */}
          <button
            onClick={() => setShowAITutor(!showAITutor)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center"
          >
            {showAITutor ? <X /> : <MessageSquare />}
          </button>

          <GestureController
            isActive={false}
            onToggle={() => {}}
            onRotate={(dx, dy) => setAtomRotation({ dx, dy })}
          />
        </>
      )}
    </div>
  );
};

// ================= ROOT APP =================
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;