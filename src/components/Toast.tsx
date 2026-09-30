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
      <div className="bg-[#12100E] text-[#FAF7F2] border border-[#12100E] px-4 py-3 shadow-2xl flex items-center space-x-3 max-w-md text-left">
        <div className="w-6 h-6 border border-[#C5A059] flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
        </div>
        <p className="text-xs font-mono pr-2 text-[#FAF7F2] leading-snug">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-[#FAF7F2]/60 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
