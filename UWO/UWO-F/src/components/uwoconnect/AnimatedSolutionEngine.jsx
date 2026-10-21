import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  CheckCircle2, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Receipt,
  Users,
  MessageSquare
} from 'lucide-react';

export default function AnimatedSolutionEngine() {
  return (
    <div className="uwoc-anim-stage uwoc-solution-stage">
      {/* Ambient Synchronized Emerald Glow */}
      <div className="uwoc-solution-glow-layer" aria-hidden="true" />
      
      {/* Precision Circular Energy Conduits & Flowing Particles */}
      <svg className="uwoc-solution-svg-canvas" viewBox="0 0 340 280" fill="none">
        {/* Outer Continuous Orbit Ring */}
        <circle 
          cx="170" 
          cy="140" 
          r="115" 
          stroke="rgba(11, 143, 120, 0.24)" 
          strokeWidth="1.6" 
          strokeDasharray="4 4"
          className="uwoc-spin-slow"
        />
        {/* Inner Synchronous Orbit Ring */}
        <circle 
          cx="170" 
          cy="140" 
          r="78" 
          stroke="rgba(16, 185, 129, 0.3)" 
          strokeWidth="1.6" 
          strokeDasharray="3 5"
          className="uwoc-spin-slow-reverse"
        />

        {/* Coordinated Inbound Synapse Laser Beams */}
        <path 
          d="M 50 65 Q 110 110, 160 135" 
          stroke="url(#solution_laser_grad)" 
          strokeWidth="2" 
        />
        <path 
          d="M 290 65 Q 230 110, 180 135" 
          stroke="url(#solution_laser_grad)" 
          strokeWidth="2" 
        />
        <path 
          d="M 50 215 Q 110 170, 160 145" 
          stroke="url(#solution_laser_grad)" 
          strokeWidth="2" 
        />
        <path 
          d="M 290 215 Q 230 170, 180 145" 
          stroke="url(#solution_laser_grad)" 
          strokeWidth="2" 
        />

        {/* Flowing Laser Particle Pulses traveling to core */}
        <circle cx="100" cy="85" r="3.5" fill="#10B981" className="uwoc-beam-inbound-1" />
        <circle cx="240" cy="85" r="3.5" fill="#34D399" className="uwoc-beam-inbound-2" />
        <circle cx="100" cy="195" r="3.5" fill="#10B981" className="uwoc-beam-inbound-3" />
        <circle cx="240" cy="195" r="3.5" fill="#34D399" className="uwoc-beam-inbound-4" />

        <defs>
          <linearGradient id="solution_laser_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B8F78" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Synchronous AI Operating Core */}
      <motion.div 
        className="uwoc-solution-center-core"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="uwoc-core-pulse-beacon" />
        <div className="uwoc-solution-core-inner">
          <Bot size={24} className="text-emerald" />
          <span className="uwoc-solution-core-label">AI ENGINE</span>
          <span className="uwoc-solution-core-sub">Unified OS</span>
        </div>
      </motion.div>

      {/* Synchronized Output Action Nodes */}
      {/* Node 1: Instant AI Copilot Reply (Top-Left) */}
      <motion.div
        className="uwoc-solution-float-node node-top-left"
        animate={{ y: [-4, 5, -4], x: [-2, 2, -2] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="uwoc-solution-live-ping" />
        <div className="uwoc-node-icon-box bg-emerald">
          <Zap size={14} />
        </div>
        <div className="uwoc-node-text-box">
          <div className="uwoc-node-head">
            <span className="uwoc-node-name">AI Auto-Reply</span>
            <span className="uwoc-node-badge badge-emerald">&lt; 0.2s</span>
          </div>
          <span className="uwoc-node-detail">Instant catalog answer sent</span>
        </div>
      </motion.div>

      {/* Node 2: Multi-Channel Inbox Unified (Top-Right) */}
      <motion.div
        className="uwoc-solution-float-node node-top-right"
        animate={{ y: [5, -5, 5], x: [2, -2, 2] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <div className="uwoc-node-icon-box bg-teal">
          <MessageSquare size={14} />
        </div>
        <div className="uwoc-node-text-box">
          <div className="uwoc-node-head">
            <span className="uwoc-node-name">One Unified Inbox</span>
            <span className="uwoc-node-badge badge-teal">Synced</span>
          </div>
          <span className="uwoc-node-detail">WhatsApp + IG + FB unified</span>
        </div>
      </motion.div>

      {/* Node 3: CRM Pipeline Auto-Creation (Bottom-Left) */}
      <motion.div
        className="uwoc-solution-float-node node-bottom-left"
        animate={{ y: [-5, 5, -5], x: [2, -2, 2] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
      >
        <div className="uwoc-node-icon-box bg-blue">
          <Users size={14} />
        </div>
        <div className="uwoc-node-text-box">
          <div className="uwoc-node-head">
            <span className="uwoc-node-name">Lead Qualified</span>
            <span className="uwoc-node-badge badge-blue">Score: 98</span>
          </div>
          <span className="uwoc-node-detail">Zero-data-entry CRM contact</span>
        </div>
      </motion.div>

      {/* Node 4: Dynamic Quotation & Deal Won (Bottom-Right) */}
      <motion.div
        className="uwoc-solution-float-node node-bottom-right"
        animate={{ y: [4, -5, 4], x: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="uwoc-node-icon-box bg-gold">
          <TrendingUp size={14} />
        </div>
        <div className="uwoc-node-text-box">
          <div className="uwoc-node-head">
            <span className="uwoc-node-name">Deal Won 🎉</span>
            <span className="uwoc-node-badge badge-gold">₹1,80,000</span>
          </div>
          <span className="uwoc-node-detail">Instant UPI proposal settled</span>
        </div>
      </motion.div>

      {/* Bottom Status Ticker Bar */}
      <div className="uwoc-solution-telemetry-bar">
        <div className="uwoc-telemetry-pill success">
          <span className="uwoc-telemetry-dot success" />
          <span>Response Velocity: <strong>&lt; 20ms</strong></span>
        </div>
        <div className="uwoc-telemetry-pill success">
          <span className="uwoc-telemetry-dot success" />
          <span>Growth Lift: <strong>+340% Won</strong></span>
        </div>
      </div>
    </div>
  );
}
