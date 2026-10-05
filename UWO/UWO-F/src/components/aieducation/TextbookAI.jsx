import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  BookOpen, Search, CheckCircle2, Bookmark, FileText, 
  Sparkles, ShieldCheck, Zap, RotateCcw, ArrowRight
} from 'lucide-react';
import { fadeInUp, staggerContainer } from './motionVariants';

const SAMPLE_QUERIES = [
  {
    id: 'physics',
    subject: 'CLASS 11-A PHYSICS',
    prompt: "Explain the law of conservation of angular momentum and how it applies to Kepler's second law.",
    sourceFile: 'NCERT_Physics_Part1_Class11.pdf',
    chunkId: 'Ch07_SystemOfParticles_Sec7.12',
    score: 0.942,
    response: "When total external torque acting on a system is zero, the total angular momentum of the system remains constant in magnitude and direction. In planetary motion, gravitational force is purely central, exerting zero torque about the Sun. Hence, areal velocity remains constant, satisfying Kepler's Second Law.",
    citations: [
      { label: 'NCERT Physics Class 11 · Chapter 7 · Page 168', color: '#00b87a' },
      { label: "Kepler's Law Corollary · Theorem 7.4", color: '#16b8e8' }
    ]
  },
  {
    id: 'cyberlaw',
    subject: 'CNLU LL.B · CYBER LAWS',
    prompt: "What are the statutory due diligence requirements for intermediary safe harbor under Section 79?",
    sourceFile: 'IT_Act_2000_Handbook_CNLU.pdf',
    chunkId: 'PartIV_Intermediary_Guidelines_Sec79',
    score: 0.968,
    response: "Under Section 79 of the Information Technology Act, an intermediary is exempt from liability if it acts merely as a conduit, does not initiate the transmission, does not modify retrieved information, and strictly observes due diligence procedures upon receiving actual knowledge via court order.",
    citations: [
      { label: 'IT Act 2000 Handbook · Section 79 · Page 242', color: '#00b87a' },
      { label: 'Shreya Singhal v. Union of India · SC Ruling', color: '#8b5cf6' }
    ]
  },
  {
    id: 'math',
    subject: 'ENGINEERING MATHEMATICS',
    prompt: "State the relation between the trace of a square matrix and its characteristic eigenvalues.",
    sourceFile: 'Higher_Engineering_Math_Sem2.pdf',
    chunkId: 'Ch04_Matrices_Eigenvalues_Theorem4.2',
    score: 0.954,
    response: "The trace of any square matrix A equals the sum of its eigenvalues, while the determinant equals their product. This follows directly from expanding the characteristic polynomial det(A - λI) = 0 and comparing coefficient terms.",
    citations: [
      { label: 'Higher Engineering Mathematics · Chapter 4 · Page 115', color: '#00b87a' },
      { label: 'Spectral Matrix Theorem · Corollary 4.2', color: '#16b8e8' }
    ]
  }
];

export default function TextbookAI() {
  const shouldReduceMotion = useReducedMotion();
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const activeQuery = SAMPLE_QUERIES[activeQueryIndex];

  // Streaming / Typing simulation state
  const [streamedText, setStreamedText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Trigger search + streaming effect when query changes
  const runQueryStream = (queryIdx) => {
    setActiveQueryIndex(queryIdx);
    const q = SAMPLE_QUERIES[queryIdx];
    
    if (shouldReduceMotion) {
      setStreamedText(q.response);
      setIsSearching(false);
      setIsStreaming(false);
      return;
    }

    setStreamedText('');
    setIsSearching(true);
    setIsStreaming(false);

    // Phase 1: RAG Vector Search (500ms)
    setTimeout(() => {
      setIsSearching(false);
      setIsStreaming(true);

      // Phase 2: Token Streaming
      let currentIdx = 0;
      const fullText = q.response;
      const stepInterval = 18; // ms per chunk

      const streamTimer = setInterval(() => {
        currentIdx += 3;
        if (currentIdx >= fullText.length) {
          setStreamedText(fullText);
          setIsStreaming(false);
          clearInterval(streamTimer);
        } else {
          setStreamedText(fullText.slice(0, currentIdx));
        }
      }, stepInterval);
    }, 550);
  };

  useEffect(() => {
    runQueryStream(0);
  }, []);

  return (
    <section className="aied-section" id="textbook-rag">
      <div className="aied-container">
        <div className="aied-section-header">
          <span className="aied-badge">
            <BookOpen size={14} />
            Class Textbook RAG Engine
          </span>
          <h2 className="aied-section-title">
            Grounded Intelligence. <br />
            <span className="aied-gradient-emerald">100% Source-Cited Answers.</span>
          </h2>
          <p className="aied-section-subtitle">
            Generic chatbots hallucinate when asked academic questions. AI Education indexes authorized 
            class textbooks, syllabi, and lecture notes, citing exact chapters and page coordinates.
          </p>
        </div>

        {/* Interactive Visual Simulation */}
        <div className="aied-rag-showcase">
          {/* Left: Interactive Retrieval Process & Query Selector */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="aied-badge" style={{ margin: 0, padding: '3px 8px', fontSize: '0.72rem' }}>
                Curriculum Ingestion Pipeline
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              From Uploaded Textbook to Precise Citation
            </h3>

            <p style={{ color: 'var(--aied-text-muted)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '16px' }}>
              When an institution uploads approved course textbooks (NCERT, State Board, University Law Handbooks), 
              the system creates an isolated vector namespace. Student queries are anchored exclusively within this material.
            </p>

            {/* Interactive Sample Prompt Switcher */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)', textTransform: 'uppercase', marginBottom: '8px' }}>
                // Test Pedagogical Scenarios:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SAMPLE_QUERIES.map((sq, i) => {
                  const isActive = activeQueryIndex === i;
                  return (
                    <button
                      key={sq.id}
                      type="button"
                      onClick={() => runQueryStream(i)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        background: isActive ? 'rgba(0, 184, 122, 0.12)' : 'var(--aied-bg-card)',
                        border: `1px solid ${isActive ? 'var(--aied-emerald)' : 'var(--aied-border)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 0 12px rgba(0, 184, 122, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.68rem', color: isActive ? 'var(--aied-emerald)' : 'var(--aied-cyan)', fontFamily: 'var(--aied-font-mono)', fontWeight: 700 }}>
                          {sq.subject}
                        </span>
                        {isActive && (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b87a', boxShadow: '0 0 6px #00b87a' }}></span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: isActive ? '#ffffff' : 'var(--aied-text-muted)', lineHeight: 1.35 }}>
                        "{sq.prompt}"
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span style={{ fontSize: '0.78rem', color: '#ffffff' }}>Strict grade and departmental curriculum scoping</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span style={{ fontSize: '0.78rem', color: '#ffffff' }}>Inline citation badges with chapter and page coordinates</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span style={{ fontSize: '0.78rem', color: '#ffffff' }}>Zero hallucination on standard exam formulas and case laws</span>
              </div>
            </div>
          </div>

          {/* Right: Simulated Real AI Study Buddy Query & Live Streaming Response UI */}
          <div style={{ background: 'var(--aied-bg-card)', border: '1px solid var(--aied-border-strong)', borderRadius: '14px', padding: '18px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
            {/* Student Prompt Bubble */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--aied-text-subtle)', fontFamily: 'var(--aied-font-mono)' }}>
                  // STUDENT INQUIRY · {activeQuery.subject}
                </span>
                <button
                  type="button"
                  onClick={() => runQueryStream(activeQueryIndex)}
                  style={{ background: 'none', border: 'none', color: 'var(--aied-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.66rem' }}
                  title="Re-run RAG retrieval simulation"
                >
                  <RotateCcw size={11} />
                  <span>Re-run</span>
                </button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--aied-border)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.8rem', color: '#ffffff' }}>
                "{activeQuery.prompt}"
              </div>
            </div>

            {/* Ingestion & Retrieval Trace with dynamic pulse */}
            <div style={{ background: 'rgba(22, 184, 232, 0.05)', border: '1px solid rgba(22, 184, 232, 0.2)', borderRadius: '7px', padding: '8px 12px', marginBottom: '14px', fontSize: '0.72rem', fontFamily: 'var(--aied-font-mono)' }}>
              <div style={{ color: 'var(--aied-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Search size={12} className={isSearching ? 'animate-spin' : ''} />
                  <span>RAG Retrieval Vector Match: {activeQuery.score} Cosine Similarity</span>
                </div>
                {isSearching && (
                  <span style={{ color: '#00b87a', fontSize: '0.66rem' }}>Indexing...</span>
                )}
              </div>
              <div style={{ color: 'var(--aied-text-muted)', fontSize: '0.68rem' }}>
                Target: <code>FileAsset/{activeQuery.sourceFile}</code> · Chunk: <code>{activeQuery.chunkId}</code>
              </div>
            </div>

            {/* AI Grounded Response Bubble with Live Streaming Text & Citations */}
            <div style={{ background: 'radial-gradient(circle at 0% 0%, #101827 0%, #080c12 100%)', border: '1px solid var(--aied-emerald-border)', borderRadius: '10px', padding: '14px', minHeight: '130px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} className="text-emerald-400" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--aied-emerald)', fontFamily: 'var(--aied-font-mono)' }}>
                    AI STUDY BUDDY (VERTEX GEMINI 2.5 FLASH)
                  </span>
                </div>
                {isStreaming && (
                  <span style={{ fontSize: '0.66rem', color: '#16b8e8', fontFamily: 'var(--aied-font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16b8e8', boxShadow: '0 0 5px #16b8e8' }}></span>
                    Streaming...
                  </span>
                )}
              </div>

              {isSearching ? (
                <div style={{ color: 'var(--aied-text-muted)', fontSize: '0.78rem', fontStyle: 'italic', padding: '10px 0' }}>
                  Querying grounded knowledge vectors in asia-south1...
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: '#ffffff', lineHeight: 1.55, margin: '0 0 12px 0' }}>
                  {streamedText}
                  {isStreaming && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      style={{ color: 'var(--aied-emerald)', fontWeight: 800, marginLeft: 2 }}
                    >
                      ▍
                    </motion.span>
                  )}
                </p>
              )}

              {/* Formatted Citation Badges with Reveal Animation */}
              {!isSearching && (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
                >
                  {activeQuery.citations.map((cite, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="aied-rag-badge" 
                      style={{ borderColor: `${cite.color}40`, color: cite.color, background: `${cite.color}10` }}
                    >
                      <Bookmark size={12} />
                      {cite.label}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
