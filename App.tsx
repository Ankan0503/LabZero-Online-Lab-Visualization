import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import AtomVisualizer from './components/AtomicVisualizer';
import PeriodicTable from './components/PeriodicTable';
import LandingPage from './components/LandingPage';
import GraphVisualizer from './components/GraphVisualizer';

import { ELEMENTS } from './constants';
import { ElementData, ViewState, TopicId, Subject, Topic } from './types';

import { MessageSquare, X } from 'lucide-react';

const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS[0]);
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showAITutor, setShowAITutor] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [atomRotation, setAtomRotation] = useState({ dx: 0, dy: 0 });

  // 🌗 Theme
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  // 🔬 Visualization Renderer
  const renderVisualization = (topicId: TopicId) => {

    // 🧪 Chemistry special case
    if (topicId === TopicId.ATOMIC_STRUCTURE) {
      return (
        <div className="flex flex-col h-full">

          <div className="flex-1 min-h-0">
            <AtomVisualizer element={selectedElement} rotation={atomRotation} />
          </div>

          <div className="h-[420px] border-t border-white/10 bg-white/5 backdrop-blur-xl overflow-y-auto">
            <PeriodicTable
              onSelect={setSelectedElement}
              selectedSymbol={selectedElement.symbol}
            />
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
            <h2 className="text-2xl font-bold mb-3 text-indigo-400">
              Theory: Atomic Structure
            </h2>
            <p className="text-slate-300">
              Atoms consist of protons, neutrons, and electrons arranged in orbitals.
              Electron configuration determines chemical properties and bonding.
            </p>
          </div>

        </div>
      );
    }

    // 📘 Default (Math + Others)
    return (
      <div className="p-8 space-y-6 overflow-y-auto h-full">

        <h1 className="text-3xl font-bold text-indigo-400">
          {selectedTopic?.name}
        </h1>

        {/* THEORY BLOCKS */}
        <div className="space-y-6">
          {selectedTopic?.theory?.split('\n\n').map((block, i) => (

            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-300"
            >

              {block.split('\n').map((line, index) => {

                // LaTeX
                if (line.startsWith('$$') && line.endsWith('$$')) {
                  return (
                    <BlockMath key={index}>
                      {line.replace(/\$\$/g, '')}
                    </BlockMath>
                  );
                }

                // Heading
                if (!line.startsWith('-') && line.length < 60) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-indigo-300 mt-2">
                      {line}
                    </h3>
                  );
                }

                // Bullet
                if (line.startsWith('-')) {
                  return (
                    <li key={index} className="ml-5 list-disc text-slate-300">
                      {line.replace('-', '')}
                    </li>
                  );
                }

                return <p key={index} className="text-slate-300">{line}</p>;
              })}

            </motion.div>

          ))}
        </div>

        {/* 📊 Graph Visualizer for Mathematics */}
        {selectedSubject?.name === "Mathematics" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <GraphVisualizer />
          </motion.div>
        )}

      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white transition-colors duration-500">

      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      {/* 🌗 Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-6 right-6 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition z-[200]"
      >
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* 🔥 Page Animations */}
      <AnimatePresence mode="wait">

        {/* Landing */}
        {viewState === ViewState.LANDING && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <LandingPage
              onSelectSubject={(subject) => {
                setSelectedSubject(subject);
                setViewState(ViewState.SUBJECT);
              }}
            />
          </motion.div>
        )}

        {/* Subject */}
        {viewState === ViewState.SUBJECT && selectedSubject && (
          <motion.div
            key="subject"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="p-10"
          >
            <button
              onClick={() => setViewState(ViewState.LANDING)}
              className="mb-6 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:scale-105 transition"
            >
              ← Back
            </button>

            <h1 className="text-4xl font-bold mb-6">
              {selectedSubject.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedSubject.topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setViewState(ViewState.TOPIC);
                  }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                >
                  <h2 className="text-xl font-semibold">{topic.name}</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    {topic.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Topic */}
        {viewState === ViewState.TOPIC && selectedTopic && (
          <motion.div
            key="topic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-10"
          >
            <button
              onClick={() => setViewState(ViewState.SUBJECT)}
              className="mb-6 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:scale-105 transition"
            >
              ← Back
            </button>

            <div className="h-[80vh]">
              {renderVisualization(selectedTopic.id)}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* 🤖 AI Button */}
      <button
        onClick={() => setShowAITutor(!showAITutor)}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 z-[100] ${
          showAITutor
            ? 'bg-rose-500 rotate-90'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-110'
        }`}
      >
        {showAITutor ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

    </div>
  );
};

export default App;