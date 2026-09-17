import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Laptop,
  Smartphone,
  Apple,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import { api } from '../services/api';

export default function HomePage({ onNavigate }) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data = await api.register({ name, email });
      setResult({
        success: true,
        message: data.message,
        userId: data.userId,
        devCredentials: data.devCredentials,
      });
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedSnippet = `<!-- 1. Add this button to your main website -->
<button id="referral-btn" style="background:#4f46e5;color:#fff;padding:12px 24px;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
  Refer & Earn 🎁
</button>

<!-- 2. Add this script tag just before </body> -->
<script src="${apiBase}/embed.js"></script>`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <nav className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              UWO™ Referral Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Test Popup Form
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <header className="max-w-4xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4" />
          UWO™ Enterprise Referral Ecosystem
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
          Centralized Referral Engine for <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            All UWO Products
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Drop a button on your website. When visitors click it, they get registered, receive their User ID and password via email, and access a portal that routes links to Desktop Web, Play Store, or App Store automatically.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowPopup(true)}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Click to Trigger Website Popup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm transition-all text-center cursor-pointer"
          >
            Go to Portal Dashboard
          </button>
        </div>
      </header>

      {/* 3-Step Flow */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-500/20">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">Main Site Button & Popup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add our 1-line script to your main website. When users click your referral button, a form pops up asking for their Name and Email.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm mb-4 border border-purple-500/20">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">Instant Credentials Delivery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              MongoDB assigns a unique User ID (e.g. <span className="font-mono text-indigo-300">USR-74921</span>) and generates a secure password, emailing them to the user.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-sm mb-4 border border-pink-500/20">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">Smart Device Redirection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Users generate links in their dashboard. When referees click, our engine detects their device and routes them instantly:
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px]">
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 flex items-center gap-1">
                <Laptop className="w-3 h-3" /> Web
              </span>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md border border-green-500/20 flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> Play Store
              </span>
              <span className="px-2 py-1 bg-slate-500/10 text-slate-300 rounded-md border border-slate-500/20 flex items-center gap-1">
                <Apple className="w-3 h-3" /> App Store
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Code Snippet */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Quick Integration for Your Website</h3>
            </div>
            <button
              onClick={() => copyCode(embedSnippet)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto">
            {embedSnippet}
          </pre>
        </div>
      </section>

      {/* Popup Modal Demo */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => {
                setShowPopup(false);
                setResult(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            {!result?.success ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Join Our Referral Program</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your name and email below. We'll generate your User ID and password and email them to you immediately.
                  </p>
                </div>

                {result?.error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{result.error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Your login credentials will be sent to this email.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Credentials & Access Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Credentials Sent! 🎉</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Your User ID and Password have been dispatched to <strong>{email}</strong>.
                </p>

                {result.devCredentials && (
                  <div className="mt-4 p-3.5 bg-slate-950 border border-indigo-500/30 rounded-xl text-left text-xs">
                    <p className="text-indigo-300 font-semibold mb-2">⚡ Quick Test Credentials (Dev Mode):</p>
                    <div className="space-y-1 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400">User ID: </span>
                        <span className="text-white font-bold">{result.devCredentials.userId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Password: </span>
                        <span className="text-white font-bold">{result.devCredentials.password}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      onNavigate('login');
                    }}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-center cursor-pointer"
                  >
                    Go to Login Page
                  </button>
                  <button
                    onClick={() => {
                      setResult(null);
                      setName('');
                      setEmail('');
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors py-2 cursor-pointer"
                  >
                    Submit another email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
