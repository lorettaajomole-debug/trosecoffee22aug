import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  scrollTargetId?: string;
  itemName?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  scrollTargetId,
  itemName = 'products'
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageSelect = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (scrollTargetId) {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate pagination items with ellipsis for large catalogues
  // Format: 1 2 3 ... 8 or 1 ... 4 5 6 ... 12
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    // Always include first page
    pages.push(1);

    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5);
      pages.push('…');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push('…');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    } else {
      pages.push('…');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('…');
      pages.push(totalPages);
    }
  }

  return (
    <div className="pt-10 sm:pt-14 pb-8 flex flex-col sm:flex-row items-center justify-between border-t border-[#0E0C0B]/15 gap-4 font-sans">
      
      {/* Items Range Counter */}
      <div className="text-xs font-mono uppercase tracking-wider text-[#0E0C0B]/70 order-2 sm:order-1 text-center sm:text-left">
        Showing <span className="font-bold text-[#0E0C0B]">{startItem}–{endItem}</span> of{' '}
        <span className="font-bold text-[#0E0C0B]">{totalItems}</span> {itemName}
      </div>

      {/* Page Navigation Controls matching exact spec:
          DESKTOP: ← PREVIOUS     1   2   3   4   5     NEXT →
          MOBILE:  ←     1   2   3   4     →
      */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 order-1 sm:order-2 select-none">
        
        {/* PREVIOUS Button */}
        <button
          onClick={() => handlePageSelect(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 border text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer ${
            currentPage === 1
              ? 'border-[#0E0C0B]/10 text-[#0E0C0B]/25 cursor-not-allowed bg-transparent'
              : 'border-[#0E0C0B]/30 text-[#0E0C0B] hover:border-[#0E0C0B] hover:bg-[#0E0C0B] hover:text-white active:scale-95'
          }`}
          aria-label="Previous catalogue page"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2]" />
          <span className="hidden sm:inline font-bold">PREVIOUS</span>
        </button>

        {/* Page Numbers with [Active] Highlight */}
        <div className="flex items-center space-x-1">
          {pages.map((p, idx) => {
            if (p === '…') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1.5 py-1 text-xs font-mono text-[#0E0C0B]/40">
                  …
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => handlePageSelect(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-9 h-9 px-2 text-xs font-mono font-bold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#0E0C0B] text-[#F4EFEA] border-[#0E0C0B] ring-2 ring-[#C88E38] shadow-sm'
                    : 'bg-white text-[#0E0C0B]/80 border-[#0E0C0B]/15 hover:border-[#0E0C0B] hover:text-[#0E0C0B]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* NEXT Button */}
        <button
          onClick={() => handlePageSelect(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 border text-xs font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer ${
            currentPage === totalPages
              ? 'border-[#0E0C0B]/10 text-[#0E0C0B]/25 cursor-not-allowed bg-transparent'
              : 'border-[#0E0C0B]/30 text-[#0E0C0B] hover:border-[#0E0C0B] hover:bg-[#0E0C0B] hover:text-white active:scale-95'
          }`}
          aria-label="Next catalogue page"
        >
          <span className="hidden sm:inline font-bold">NEXT</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
        </button>

      </div>

    </div>
  );
};
