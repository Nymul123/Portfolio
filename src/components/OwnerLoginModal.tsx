import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, User, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { usePortfolio, OWNER_CREDENTIALS } from '../context/PortfolioContext';

export const OwnerLoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, login, isOwner, setAdminConsoleOpen } = usePortfolio();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (loginModalOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setSuccess(false);
    }
  }, [loginModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && loginModalOpen) {
        setLoginModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loginModalOpen, setLoginModalOpen]);

  if (!loginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both User ID and Password.');
      return;
    }

    const ok = login(username, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setLoginModalOpen(false);
        setAdminConsoleOpen(true);
      }, 700);
    } else {
      setError('Invalid Owner User ID or Password. Check credentials.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setLoginModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-md bg-[#FAF7F2] border border-[#E3D9CC] rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top maroon accent bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#6E0D1B] via-[#8B1E2D] to-[#6E0D1B]" />

        {/* Close Button */}
        <button
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#EFE7DC] transition-colors"
          aria-label="Close owner login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#7B1123]/10 border border-[#7B1123]/20 flex items-center justify-center text-[#7B1123] mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#3B0E14] tracking-tight">
            Owner Management Portal
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
            Authorized administrative access to add, update, and remove items across all 5 portfolio sections.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Owner authentication verified! Opening console...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* User ID - Auto-fill disabled */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Owner User ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="admin_user_unique"
                id="admin_user_unique"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter owner user ID"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD3C4] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#7B1123] focus:ring-1 focus:ring-[#7B1123] transition-all"
              />
            </div>
          </div>

          {/* Password - Auto-fill disabled */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="admin_pass_unique"
                id="admin_pass_unique"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret password"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#DDD3C4] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#7B1123] focus:ring-1 focus:ring-[#7B1123] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>


          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#7B1123] hover:bg-[#670D1B] active:scale-[0.98] text-[#FAF7F2] font-semibold text-sm rounded-xl transition-all shadow-md shadow-[#7B1123]/20 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Login as Owner</span>
          </button>
        </form>
      </div>
    </div>
  );
};
