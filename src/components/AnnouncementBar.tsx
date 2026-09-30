import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenQuiz: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenQuiz }) => {
  return (
    <aside aria-label="Announcement" className="bg-[#12100E] text-[#FAF6F0] text-[11px] py-2.5 px-6 tracking-[0.16em] uppercase font-sans font-medium border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="hidden md:flex items-center space-x-2 text-[#CCA347] font-semibold">
          <span className="w-1.5 h-1.5 bg-[#CCA347] inline-block" />
          <span>RISE. REFRESH. REIGN.</span>
        </div>
        
        <div className="w-full md:w-auto text-center flex items-center justify-center space-x-2.5">
          <span className="text-white/90">COMPLIMENTARY US SHIPPING OVER $65</span>
          <span className="text-[#CCA347]">/</span>
          <button 
            id="announcement-quiz-btn"
            onClick={onOpenQuiz}
            className="text-[#CCA347] hover:text-white font-semibold transition-colors inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>FIND YOUR TROSE</span>
            <ArrowRight className="w-3 h-3 ml-0.5 text-[#CCA347]" />
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-white/60 text-[10px] tracking-[0.16em]">
          <span className="text-[#CCA347]">●</span>
          <span>BALANCE WITH BOLDNESS</span>
        </div>

      </div>
    </aside>
  );
};
