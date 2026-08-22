import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <div className="bg-[#3C2A21] text-[#FDFBF7] border border-[#C5A059]/40 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 max-w-md">
        <div className="w-7 h-7 rounded-lg bg-[#C5A059]/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-[#E5C378]" />
        </div>
        <p className="text-xs font-light pr-2 text-[#FDFBF7] leading-snug">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-[#FDFBF7]/60 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

