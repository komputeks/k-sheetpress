import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={buildUrl(currentPage - 1)} className="btn-ghost gap-1 text-xs">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
        .map((page, idx, arr) => {
          const prev = arr[idx - 1];
          const showEllipsis = prev && page - prev > 1;
          return (
            <span key={page} className="flex items-center gap-2">
              {showEllipsis && <span className="text-white/30">...</span>}
              <Link
                href={buildUrl(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ${
                  page === currentPage
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                {page}
              </Link>
            </span>
          );
        })}
      {currentPage < totalPages && (
        <Link href={buildUrl(currentPage + 1)} className="btn-ghost gap-1 text-xs">
          Next <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
