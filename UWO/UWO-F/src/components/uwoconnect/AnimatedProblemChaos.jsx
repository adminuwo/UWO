import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  XCircle, 
  FileSpreadsheet, 
  MessageSquare, 
  Mail 
} from 'lucide-react';

export default function AnimatedProblemChaos() {
  return (
    <div className="uwoc-anim-stage uwoc-problem-stage">
      {/* Ambient Chaotic Warning Glow */}
      <div className="uwoc-chaos-glow-layer" aria-hidden="true" />
      
      {/* Broken Orbital Radar & Disconnected Wires */}
      <svg className="uwoc-chaos-svg-canvas" viewBox="0 0 340 280" fill="none">
        {/* Broken Outer Dashed Arc */}
        <circle 
          cx="170" 
          cy="140" 
          r="115" 
          stroke="rgba(239, 68, 68, 0.22)" 
          strokeWidth="1.5" 
          strokeDasharray="6 8"
          className="uwoc-spin-slow-reverse"
        />
        {/* Broken Inner Warning Ring */}
        <circle 
          cx="170" 
          cy="140" 
          r="75" 
          stroke="rgba(245, 158, 11, 0.25)" 
          strokeWidth="1.5" 
          strokeDasharray="4 6"
          className="uwoc-spin-slow"
        />

        {/* Tangled Broken Conduit Lines */}
        <path 
          d="M 60 70 Q 120 130, 160 140" 
          stroke="rgba(239, 68, 68, 0.35)" 
          strokeWidth="1.8" 
          strokeDasharray="3 3" 
        />
        <path 
          d="M 280 60 Q 210 110, 170 140" 
          stroke="rgba(245, 158, 11, 0.35)" 
          strokeWidth="1.8" 
          strokeDasharray="3 3" 
        />
        <path 
          d="M 50 200 Q 110 180, 160 150" 
          stroke="rgba(239, 68, 68, 0.3)" 
          strokeWidth="1.8" 
          strokeDasharray="4 4" 
        />
        <path 
          d="M 290 210 Q 220 180, 180 150" 
          stroke="rgba(245, 158, 11, 0.3)" 
          strokeWidth="1.8" 
          strokeDasharray="4 4" 
        />

        {/* Disconnect Sparks */}
        <circle cx="160" cy="140" r="3" fill="#EF4444" className="uwoc-spark-pulse" />
        <circle cx="170" cy="140" r="4" fill="#F59E0B" className="uwoc-spark-pulse-delayed" />
        <circle cx="180" cy="150" r="3" fill="#DC2626" className="uwoc-spark-pulse" />
      </svg>

      {/* Center Lag Core */}
      <motion.div 
        className="uwoc-chaos-center-core"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="uwoc-chaos-core-inner">
          <Clock size={22} className="text-red-500" />
          <span className="uwoc-chaos-core-label">4h 12m</span>
          <span className="uwoc-chaos-core-sub">Average Lag</span>
        </div>
      </motion.div>

      {/* Floating Chaotic App Alert Nodes */}
      {/* Node 1: WhatsApp Missed Lead (Top-Left) */}
      <motion.div
        className="uwoc-chaos-float-node node-top-left"
        animate={{ y: [-5, 6, -5], x: [-3, 3, -3] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="uwoc-chaos-alert-ping" />
        <div className="uwoc-node-icon-box bg-red">
          <i className="fa-brands fa-whatsapp"></i>
        </div>
        <div className="uwoc-node-text-box">
          <div className="uwoc-node-head">
            <span className="uwoc-node-name">WhatsApp</span>
            <span className="uwoc-node-badge badge-red">Unanswered</span>
          </div>
          <span className="uwoc-node-detail">Lost buyer after 30m</span>
        </div>
      </motion.div>

      {/* Node 2: Instagram Dropped Inquiry (Top-Right) */}
      <motion.div
        className="uwoc-chaos-float-node node-top-right"
        animate={{ y: [6, -6, 6], x: [3, -3, 3] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        <span className="uwoc-chaos-alert-ping ping-amber" />
        <div className="uwoc-node-icon-box bg-amber">
          <i className="fa-brands fa-instagram"></i>
        </div>
        <div className="uwoc-node-text-box">
          <div className="uwoc-node-head">
            <span className="uwoc-node-name">Instagram DM</span>
            <span className="uwoc-node-badge badge-amber">Dropped</span>
          </div>
          <span className="uwoc-node-detail">Pricing query buried</span>
        </div>
      </motion.div>

      {/* Node 3: Manual Spreadsheet Overhead (Bottom-Left) */}
      <motion.div
        className="uwoc-chaos-float-node node-bottom-left"
        animate={{ y: [-6, 5, -6], x: [2, -2, 2] }}
        transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <div className="uwoc-node-icon-box bg-slate">
          <FileSpreadsheet size={15} />
        </div>
        <div className="uwoc-node-text-box">
          <div className="uwoc-node-head">
            <span className="uwoc-node-name">Manual Excel</span>
            <span className="uwoc-node-badge badge-slate">Slow</span>
          </div>
          <span className="uwoc-node-detail">Copy-paste data entry</span>
        </div>
      </motion.div>

      {/* Node 4: Disconnected Email Thread (Bottom-Right) */}
      <motion.div
        className="uwoc-chaos-float-node node-bottom-right"
        animate={{ y: [5, -5, 5], x: [-3, 3, -3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
      >
        <div className="uwoc-node-icon-box bg-red">
          <Mail size={15} />
        </div>
        <div className="uwoc-node-text-box">
          <div className="uwoc-node-head">
            <span className="uwoc-node-name">Gmail Thread</span>
            <span className="uwoc-node-badge badge-red">Siloed</span>
          </div>
          <span className="uwoc-node-detail">Context lost between reps</span>
        </div>
      </motion.div>

      {/* Bottom Status Ticker Bar */}
      <div className="uwoc-chaos-telemetry-bar">
        <div className="uwoc-telemetry-pill warning">
          <span className="uwoc-telemetry-dot warning" />
          <span>Inquiries Dropped: <strong>38%</strong></span>
        </div>
        <div className="uwoc-telemetry-pill danger">
          <span className="uwoc-telemetry-dot danger" />
          <span>Context Switches: <strong>8+ Apps</strong></span>
        </div>
      </div>
    </div>
  );
}
