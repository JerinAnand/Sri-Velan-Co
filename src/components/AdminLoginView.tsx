import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Info, KeyRound } from 'lucide-react';
import { COMPANY_DETAILS } from '../data';

export const AdminLoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after login
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access temporarily disabled due to multiple failed attempts. Try again later.');
      } else {
        setError(err.message || 'Failed to authenticate. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-brand-blue-900 to-neutral-900 rounded-2xl border border-brand-gold-500/30 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-brand-gold-400" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
              {COMPANY_DETAILS.name}
            </h1>
            <p className="font-mono text-[11px] text-brand-gold-400 uppercase tracking-widest mt-1">
              Live Firestore Admin Portal
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-neutral-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-white">Administrative Sign In</h2>
            <p className="text-xs text-neutral-400 font-light">
              Enter your Firebase Authentication admin credentials to modify live site content in real time.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-xs leading-relaxed animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-semibold">Authentication Failed</p>
                <p className="text-red-300/80 font-light mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-x-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@srivelanco.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold-500/50 focus:border-brand-gold-500 transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-x-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-gold-500/50 focus:border-brand-gold-500 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-gold-500 to-amber-500 hover:from-brand-gold-400 hover:to-amber-400 text-brand-blue-950 font-display font-extrabold text-sm uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-brand-blue-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Console Admin User Setup Instruction Card */}
          <div className="bg-brand-gold-950/20 border border-brand-gold-500/20 rounded-2xl p-4 text-xs space-y-2 text-neutral-300">
            <div className="flex items-center gap-2 text-brand-gold-400 font-bold font-mono uppercase text-[11px]">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>Firebase Account Setup Reminder</span>
            </div>
            <p className="text-[11px] font-light leading-relaxed text-neutral-400">
              Public self-registration is disabled for safety. Create your admin user account manually in:
            </p>
            <div className="bg-neutral-950 p-2 rounded-lg font-mono text-[10px] text-brand-gold-300 border border-white/5 break-all">
              Firebase Console &gt; Authentication &gt; Users &gt; Add user
            </div>
          </div>
        </div>

        {/* Return to Public Site link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
