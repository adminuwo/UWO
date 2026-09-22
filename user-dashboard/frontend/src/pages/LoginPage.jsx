import { useState } from 'react';
import { KeyRound, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Gift } from 'lucide-react';
import { api, setToken } from '../services/api';

export default function LoginPage({ onLoginSuccess, onNavigate }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const websiteUrl = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:3000'
    : (import.meta.env.VITE_WEBSITE_URL || 'https://uwo24.com');
  const earnReferUrl = `${websiteUrl}/?action=earn-refer`;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login({ identifier, password });
      setToken(data.token);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">UWO™ Referral Portal</h1>
          <p className="text-slate-400 text-sm mt-2">
            Log in with your emailed User ID or Email to manage links across all UWO products
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                User ID or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. USR-74921 or your@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Use the User ID or Email that was sent to your inbox.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center my-4">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-xs font-medium uppercase tracking-wider">
              Need an Account?
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <a
            href={earnReferUrl}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500/10 via-indigo-600/15 to-amber-500/10 hover:from-amber-500/20 hover:via-indigo-600/25 hover:to-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/5 group text-center"
          >
            <Gift className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span>Get a Referral Account / Create User Account</span>
            <ArrowRight className="w-4 h-4 text-amber-400/80 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured with MongoDB Authentication & Device Analytics</span>
        </div>
      </div>
    </div>
  );
}
