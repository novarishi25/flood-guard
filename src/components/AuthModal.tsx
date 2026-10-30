import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { switchRole, currentUser, showNotification } = useFloodGuard();

  const [email, setEmail] = useState<string>('admin@floodguard.com');
  const [password, setPassword] = useState<string>('Admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const normEmail = email.toLowerCase().trim();
    if (normEmail.includes('admin') && password === 'Admin123') {
      switchRole('admin');
      onClose();
    } else if (normEmail.includes('rescue') && password === 'Rescue123') {
      switchRole('rescue');
      onClose();
    } else if (normEmail.includes('citizen') && password === 'Citizen123') {
      switchRole('citizen');
      onClose();
    } else {
      setErrorMsg('Invalid demonstration credentials. Use demo buttons or credentials below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0d2137] border border-cyan-500/40 rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Disaster Network Authentication
              </h3>
              <p className="text-[11px] text-slate-400">
                Role-based municipal control room access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* 1-Click Demo Shortcut Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>HACKATHON QUICK LOGIN:</span>
            <span className="text-cyan-400">Click to switch role</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl bg-[#071426] hover:bg-[#102A43] border border-cyan-500/40 text-left transition-all"
            >
              <span className="text-xs font-bold text-cyan-300 block">Administrator</span>
              <span className="text-[10px] text-slate-400 block font-mono">admin@</span>
            </button>

            <button
              onClick={() => handleQuickLogin('rescue')}
              className="p-2.5 rounded-xl bg-[#071426] hover:bg-[#102A43] border border-amber-500/40 text-left transition-all"
            >
              <span className="text-xs font-bold text-amber-300 block">Rescue Team</span>
              <span className="text-[10px] text-slate-400 block font-mono">rescue@</span>
            </button>

            <button
              onClick={() => handleQuickLogin('citizen')}
              className="p-2.5 rounded-xl bg-[#071426] hover:bg-[#102A43] border border-emerald-500/40 text-left transition-all"
            >
              <span className="text-xs font-bold text-emerald-300 block">Citizen</span>
              <span className="text-[10px] text-slate-400 block font-mono">citizen@</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-700/60"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-mono uppercase">Or sign in manually</span>
          <div className="flex-grow border-t border-slate-700/60"></div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@floodguard.com"
              className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl bg-[#071426] border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071426] font-black text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            Authenticate Credentials
          </button>
        </form>

        <div className="p-3 rounded-xl bg-[#071426] border border-slate-800 text-[10px] text-slate-400 space-y-1 font-mono">
          <div className="text-slate-300 font-bold">Hackathon Demo Credentials:</div>
          <div>Admin: admin@floodguard.com / Admin123</div>
          <div>Rescue: rescue@floodguard.com / Rescue123</div>
          <div>Citizen: citizen@floodguard.com / Citizen123</div>
        </div>
      </div>
    </div>
  );
};
