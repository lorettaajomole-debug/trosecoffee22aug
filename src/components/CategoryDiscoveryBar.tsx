import React from 'react';
import { ArrowRight, Coffee, CupSoda, ShoppingBag, Wrench, Sparkles } from 'lucide-react';
import { CategoryInfo } from '../services/categoryManager';

interface CategoryDiscoveryBarProps {
  categories: CategoryInfo[];
  onSelectCategory: (categoryId: string) => void;
  onOpenQuiz?: () => void;
}

export const CategoryDiscoveryBar: React.FC<CategoryDiscoveryBarProps> = ({
  categories,
  onSelectCategory,
  onOpenQuiz
}) => {
  if (categories.length === 0) return null;

  return (
    <section className="bg-[#FAF7F2] border-b border-[#0E0C0B]/10 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#C88E38] font-bold">
            <span className="w-4 h-[1.5px] bg-[#C88E38]" />
            <span>EXPLORE BY CATEGORY</span>
          </div>

          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#0E0C0B] hover:text-[#C88E38] flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3 h-3 text-[#C88E38]" />
              <span>NOT SURE? TAKE THE 60-SEC QUIZ →</span>
            </button>
          )}
        </div>

        {/* Quick Category Buttons in Strict Priority Order */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {categories.map((cat, idx) => {
            const isCoffee = cat.id === 'coffee';
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-3 text-left border transition-all cursor-pointer group flex flex-col justify-between ${
                  isCoffee
                    ? 'bg-[#F4EFEA] border-[#C88E38] shadow-xs hover:border-[#0E0C0B]'
                    : 'bg-white border-[#0E0C0B]/15 hover:border-[#0E0C0B] hover:bg-[#F4EFEA]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold text-[#C88E38] uppercase tracking-wider">
                    {`0${idx + 1}`}
                  </span>
                  {isCoffee && (
                    <span className="text-[8px] font-mono font-bold bg-[#8A2B2B] text-white px-1 py-0.2 rounded-xs">
                      CORE
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-extrabold uppercase tracking-wider text-[#0E0C0B] group-hover:text-[#C88E38] transition-colors">
                    {cat.navLabel}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0E0C0B]/40 group-hover:text-[#C88E38] group-hover:translate-x-0.5 transition-all" />
                </div>

                <span className="text-[10px] font-mono text-[#0E0C0B]/60 mt-0.5">
                  {cat.productCount} {cat.productCount === 1 ? 'item' : 'items'}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
