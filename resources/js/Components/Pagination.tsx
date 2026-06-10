import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationProps {
    meta: {
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    preserveScroll?: boolean;
}

export default function Pagination({ meta, preserveScroll = true }: PaginationProps) {
    const { current_page: current, last_page: total } = meta;

    if (total <= 1) return null;

    // Helper to generate the URL with current filters and updated page parameter
    const getPageUrl = (page: number) => {
        if (typeof window === 'undefined') return '#';
        const params = new URLSearchParams(window.location.search);
        params.set('page', page.toString());
        return `${window.location.pathname}?${params.toString()}`;
    };

    // Pagination generation logic for `< 1 2 3 ... 20 21 >`
    const getPageRange = () => {
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        if (current <= 4) {
            return [1, 2, 3, 4, 5, '...', total];
        }

        if (current >= total - 3) {
            return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        }

        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const pages = getPageRange();

    return (
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-4 sm:px-6 mt-4 rounded-b-xl">
            {/* Mobile simplified pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
                {current > 1 ? (
                    <Link
                        href={getPageUrl(current - 1)}
                        preserveScroll={preserveScroll}
                        className="relative inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                        Sebelumnya
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                        Sebelumnya
                    </span>
                )}
                {current < total ? (
                    <Link
                        href={getPageUrl(current + 1)}
                        preserveScroll={preserveScroll}
                        className="relative ml-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                        Berikutnya
                    </Link>
                ) : (
                    <span className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                        Berikutnya
                    </span>
                )}
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        Menampilkan <span className="font-semibold text-gray-800">{meta.from || 0}</span> sampai{' '}
                        <span className="font-semibold text-gray-800">{meta.to || 0}</span> dari{' '}
                        <span className="font-semibold text-gray-800">{meta.total}</span> data
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm bg-gray-50 p-1" aria-label="Pagination">
                        {/* Prev Button */}
                        {current > 1 ? (
                            <Link
                                href={getPageUrl(current - 1)}
                                preserveScroll={preserveScroll}
                                className="relative inline-flex items-center rounded-md px-2.5 py-1.5 text-gray-500 hover:bg-white hover:text-blue-600 transition-all duration-200 hover:shadow-xs me-1 font-medium"
                                title="Halaman Sebelumnya"
                            >
                                <i className="bi bi-chevron-left text-sm"></i>
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center rounded-md px-2.5 py-1.5 text-gray-300 cursor-not-allowed me-1">
                                <i className="bi bi-chevron-left text-sm"></i>
                            </span>
                        )}

                        {/* Page Numbers */}
                        {pages.map((page, index) => {
                            if (page === '...') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="relative inline-flex items-center px-3 py-1.5 text-sm font-semibold text-gray-400 cursor-default select-none"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const isCurrent = page === current;

                            return (
                                <Link
                                    key={`page-${page}`}
                                    href={getPageUrl(page as number)}
                                    preserveScroll={preserveScroll}
                                    className={`relative inline-flex items-center rounded-md px-3.5 py-1.5 text-sm font-semibold transition-all duration-250 mx-0.5 ${
                                        isCurrent
                                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                            : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-xs border border-transparent hover:border-gray-100'
                                    }`}
                                >
                                    {page}
                                </Link>
                            );
                        })}

                        {/* Next Button */}
                        {current < total ? (
                            <Link
                                href={getPageUrl(current + 1)}
                                preserveScroll={preserveScroll}
                                className="relative inline-flex items-center rounded-md px-2.5 py-1.5 text-gray-500 hover:bg-white hover:text-blue-600 transition-all duration-200 hover:shadow-xs ms-1 font-medium"
                                title="Halaman Berikutnya"
                            >
                                <i className="bi bi-chevron-right text-sm"></i>
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center rounded-md px-2.5 py-1.5 text-gray-300 cursor-not-allowed ms-1">
                                <i className="bi bi-chevron-right text-sm"></i>
                            </span>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
}
