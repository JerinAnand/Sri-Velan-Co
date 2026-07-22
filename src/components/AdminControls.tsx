import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
  ShieldCheck, 
  LogOut, 
  RotateCcw, 
  X, 
  KeyRound, 
  AlertCircle,
  Sliders,
  Database,
  MapPin,
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminControls() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const {
    isAdmin,
    login,
    logout,
    resetToDefaults,
    showLoginModal,
    setShowLoginModal,
    resetCategories,
  } = useAdmin();

  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Bulk reset states
  const [showBulkResetModal, setShowBulkResetModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Equipment Specs',
    'Stats',
    'Project Counters',
    'Milestones'
  ]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleBulkResetExecute = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category to reset.');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to reset all overrides in: ${selectedCategories.join(', ')}?`
      )
    ) {
      resetCategories(selectedCategories);
      setShowBulkResetModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setPassword('');
      setError(false);
      setShowLoginModal(false);
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setPassword('');
    setError(false);
  };

  return (
    <>
      {/* Floating Admin Portal Shortcut Button (shown when not logged in & not on admin routes) */}
      {!isAdmin && !isAdminPage && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 left-20 sm:left-24 z-40"
          id="admin-portal-floating-container"
        >
          <button
            onClick={() => navigate('/admin/login')}
            className="bg-neutral-900/90 hover:bg-neutral-800 text-brand-gold-400 border border-brand-gold-500/30 hover:border-brand-gold-500 rounded-full sm:rounded-xl p-3 sm:px-4 sm:py-2.5 shadow-2xl backdrop-blur-md transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
            title="Access Admin Portal"
            aria-label="Admin Portal Gateway"
          >
            <ShieldCheck className="w-5 h-5 text-brand-gold-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-display font-bold text-xs uppercase tracking-wider text-white group-hover:text-brand-gold-400 transition-colors whitespace-nowrap">
              Admin Portal
            </span>
          </button>
        </motion.div>
      )}

      {/* 1. Admin Mode Status Indicator Panel */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 border-t-2 border-brand-gold-500 backdrop-blur-md text-white py-2.5 px-3 sm:py-3.5 sm:px-6 shadow-2xl flex flex-row items-center justify-between gap-2 sm:gap-4 select-none font-sans"
            id="admin-status-bar"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1 sm:p-1.5 bg-brand-gold-500/10 border border-brand-gold-500/30 rounded-lg text-brand-gold-400 animate-pulse shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="font-display font-black text-[11px] sm:text-xs uppercase tracking-widest text-brand-gold-400 truncate">
                  <span className="sm:hidden">Admin Active</span>
                  <span className="hidden sm:inline">Sri Velan Admin Mode: Active</span>
                </p>
                <p className="hidden md:block text-[10px] text-neutral-400 font-mono truncate">
                  All inline numbers are editable. Hover or click to alter parameters.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowBulkResetModal(true)}
                className="flex items-center justify-center gap-1.5 bg-neutral-800 hover:bg-neutral-750 text-brand-gold-400 font-display font-bold text-[10px] uppercase tracking-wider py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-lg sm:rounded-xl border border-neutral-700 hover:border-brand-gold-500/30 transition-all cursor-pointer"
                title="Granularly reset overrides by category"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-gold-400 shrink-0" />
                <span className="hidden sm:inline">Bulk Reset</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                className="flex items-center justify-center gap-1.5 bg-red-950/40 hover:bg-red-900/30 text-red-300 font-display font-black text-[10px] uppercase tracking-wider py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-lg sm:rounded-xl border border-red-900/40 hover:border-red-500/30 transition-colors cursor-pointer"
                title="End administrator session"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Admin Login Modal dialog */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            id="admin-login-modal-overlay"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0c1420] border border-brand-gold-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl text-left font-sans"
              id="admin-login-modal"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                aria-label="Close Admin Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand-gold-500/10 border border-brand-gold-500/20 rounded-2xl text-brand-gold-400">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                    Admin Portal Gateway
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                    Authorized Personnel Only
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    Administrator Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoFocus
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-brand-gold-500 text-white rounded-xl py-3 px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-brand-gold-500 placeholder-neutral-600"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-950/20 border border-red-900/50 rounded-xl p-3 flex items-start gap-2 text-red-300 text-xs leading-relaxed"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span>Incorrect passcode. Access is strictly logged and restricted.</span>
                  </motion.div>
                )}

                <p className="text-[10px] text-neutral-500 font-mono leading-relaxed bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-900">
                  Hint: Secure session authorization is granted exclusively to credentialed municipal coordinators and dispatch managers.
                </p>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-neutral-900 hover:bg-neutral-850 text-neutral-300 font-display font-bold text-xs uppercase px-5 py-3 rounded-xl border border-neutral-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Authorize Session
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Granular Bulk Reset Modal */}
      <AnimatePresence>
        {showBulkResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBulkResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0c1420] border border-brand-gold-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl text-left font-sans"
            >
              <button
                onClick={() => setShowBulkResetModal(false)}
                className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                aria-label="Close Bulk Reset Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand-gold-500/10 border border-brand-gold-500/20 rounded-2xl text-brand-gold-400 animate-pulse">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                    Granular Bulk Reset
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                    Select categories to revert to original defaults
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Choose which segments of the application overrides to clear. Untoggled categories will remain customized.
                </p>

                <div className="space-y-2">
                  {[
                    { id: 'Stats', label: 'Stats & Core Counters', desc: 'Enterprise age, years of legacy, heavy machineries fleet size' },
                    { id: 'Equipment Specs', label: 'Equipment Specs', desc: 'Discharge capacities, engine HP, Autonomies for derrick/pumps' },
                    { id: 'Project Counters', label: 'Project Counters', desc: 'Active pumps, on-field staff, and floods managed in all 15 zones' },
                    { id: 'Milestones', label: 'Milestones', desc: 'Corporate history events, timeline tags, title years' }
                  ].map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-gold-500/10 border-brand-gold-500/35 text-white shadow-inner'
                            : 'bg-neutral-900/60 border-neutral-850 text-neutral-450 hover:border-neutral-800'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-brand-gold-400" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-550" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-white">{cat.label}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5 font-sans leading-tight">{cat.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCategories.length === 4) {
                      setSelectedCategories([]);
                    } else {
                      setSelectedCategories(['Stats', 'Equipment Specs', 'Project Counters', 'Milestones']);
                    }
                  }}
                  className="text-[10px] font-mono uppercase text-brand-gold-400 hover:text-brand-gold-300 px-2 py-1 cursor-pointer"
                >
                  {selectedCategories.length === 4 ? 'Deselect All' : 'Select All'}
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBulkResetModal(false)}
                    className="bg-neutral-900 hover:bg-neutral-850 text-neutral-300 font-display font-bold text-xs uppercase px-4 py-2 rounded-xl border border-neutral-850 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkResetExecute}
                    className="bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 font-display font-extrabold text-xs uppercase px-5 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Reset Selected
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
