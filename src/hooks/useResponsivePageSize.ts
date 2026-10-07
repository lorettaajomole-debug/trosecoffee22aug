import { useState, useEffect } from 'react';

/**
 * Provides product page size: 12 products per page (Mobile = 2 columns × 6 rows = 12)
 */
export function useResponsivePageSize(mobileSize = 12, desktopSize = 12): number {
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
