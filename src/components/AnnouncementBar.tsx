import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenQuiz: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenQuiz }) => {
  return (
    <aside aria-label="Announcement" className="bg-[#1F1612] text-[#FAF6F0] text-[11px] py-2.5 px-4 tracking-[0.14em] uppercase font-sans border-b border-[#2C211B]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-[#E65F38] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D63426] inline-block animate-pulse"></span>
          <span className="text-[10px] tracking-[0.2em] font-mono">FRESH SMALL-BATCH ROASTS</span>
        </div>
        
        <div className="w-full md:w-auto text-center flex items-center justify-center space-x-2 font-normal">
          <span className="text-[#FAF6F0]/90">Free tasting flight on orders over $65</span>
          <span className="text-[#D63426]">•</span>
          <button 
            id="announcement-quiz-btn"
            onClick={onOpenQuiz}
            className="text-[#FAF6F0] hover:text-[#D63426] font-semibold underline underline-offset-4 decoration-[#D63426] hover:decoration-[#D63426] transition-colors inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>Find Your Coffee</span>
            <ArrowRight className="w-3 h-3 ml-0.5 text-[#D63426]" />
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-[#EBF1E6] text-[10px] tracking-[0.18em] font-mono">
          <span className="text-[#657953]">●</span>
          <span className="text-[#FAF6F0]/80">SHIPPED IN 48 HOURS</span>
        </div>
      </div>
    </aside>
  );
};


