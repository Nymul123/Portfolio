import React from 'react';
import { Shield, Settings, Plus, LogOut } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const OwnerFloatingBar: React.FC = () => {
  const { isOwner, setAdminConsoleOpen, logout } = usePortfolio();

  if (!isOwner) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-[#FAF7F2] border border-[#DDD3C4] shadow-2xl rounded-2xl p-2 flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-[#7B1123] font-bold font-mono border-r border-[#DDD3C4]">
          <Shield className="w-3.5 h-3.5 text-[#7B1123]" />
          <span className="hidden sm:inline">Owner Mode</span>
        </div>

        <button
          onClick={() => setAdminConsoleOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7B1123] hover:bg-[#670D1B] text-[#FAF7F2] font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Manage Sections</span>
        </button>

        <button
          onClick={logout}
          className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-stone-100 rounded-lg transition-colors"
          title="Logout from Owner Mode"
          aria-label="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
