import { useState, useEffect } from 'react';

/**
 * Provides responsive product page size:
 * - Mobile (< 640px): 6 items per page to prevent vertical scrolling fatigue
 * - Desktop (>= 640px): 12 items per page as requested in specification
 */
export function useResponsivePageSize(mobileSize = 6, desktopSize = 12): number {
  const [pageSize, setPageSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? mobileSize : desktopSize;
    }
    return desktopSize;
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      setPageSize(isMobile ? mobileSize : desktopSize);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSize, desktopSize]);

  return pageSize;
}
