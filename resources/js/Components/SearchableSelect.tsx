import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    label?: string;
    placeholder?: string;
    value: string | number;
    onChange: (value: string) => void;
    options: SelectOption[];
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function SearchableSelect({
    label,
    placeholder = 'Pilih...',
    value,
    onChange,
    options,
    error,
    required,
    disabled,
    className = '',
}: SearchableSelectProps) {
    const [isOpen, setIsOpen]       = useState(false);
    const [search, setSearch]       = useState('');
    const [highlighted, setHighlighted] = useState(0);

    const containerRef  = useRef<HTMLDivElement>(null);
    const searchRef     = useRef<HTMLInputElement>(null);
    const listRef       = useRef<HTMLUListElement>(null);

    // Label of the currently selected option
    const selectedLabel = options.find(o => String(o.value) === String(value))?.label ?? '';

    // Filtered list
    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    // Open dropdown
    const open = () => {
        if (disabled) return;
        setIsOpen(true);
        setSearch('');
        setHighlighted(0);
        setTimeout(() => searchRef.current?.focus(), 0);
    };

    // Close dropdown
    const close = useCallback(() => {
        setIsOpen(false);
        setSearch('');
    }, []);

    // Select an option
    const select = (opt: SelectOption) => {
        onChange(String(opt.value));
        close();
    };

    // Click outside to close
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [close]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) { if (e.key === 'Enter' || e.key === ' ') open(); return; }
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlighted(h => Math.min(h + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlighted(h => Math.max(h - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[highlighted]) select(filtered[highlighted]);
        }
    };

    // Scroll highlighted item into view
    useEffect(() => {
        const el = listRef.current?.children[highlighted] as HTMLElement;
        el?.scrollIntoView({ block: 'nearest' });
    }, [highlighted]);

    return (
        <div className={`ss-wrapper ${className}`} ref={containerRef}>
            {label && (
                <label className="form-label-c">
                    {label}
                    {required && <span className="ss-required">*</span>}
                </label>
            )}

            {/* Trigger button */}
            <button
                type="button"
                className={`ss-trigger ${error ? 'ss-error' : ''} ${disabled ? 'ss-disabled' : ''}`}
                onClick={isOpen ? close : open}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <span className={`ss-value ${!selectedLabel ? 'ss-placeholder' : ''}`}>
                    {selectedLabel || placeholder}
                </span>
                <i className={`bi bi-chevron-down ss-chevron ${isOpen ? 'ss-chevron-open' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="ss-dropdown">
                    {/* Search box */}
                    <div className="ss-search-wrap">
                        <i className="bi bi-search ss-search-icon" />
                        <input
                            ref={searchRef}
                            type="text"
                            className="ss-search"
                            placeholder="Cari..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setHighlighted(0); }}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {/* Options list */}
                    <ul ref={listRef} className="ss-list" role="listbox">
                        {filtered.length === 0 ? (
                            <li className="ss-empty">Tidak ada hasil</li>
                        ) : filtered.map((opt, i) => (
                            <li
                                key={opt.value}
                                role="option"
                                aria-selected={String(opt.value) === String(value)}
                                className={[
                                    'ss-option',
                                    String(opt.value) === String(value) ? 'ss-option-selected' : '',
                                    i === highlighted ? 'ss-option-highlighted' : '',
                                ].join(' ')}
                                onMouseEnter={() => setHighlighted(i)}
                                onMouseDown={e => { e.preventDefault(); select(opt); }}
                            >
                                {String(opt.value) === String(value) && (
                                    <i className="bi bi-check2 ss-check" />
                                )}
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p className="ss-error-msg">{error}</p>}
        </div>
    );
}
