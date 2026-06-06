import { useEffect, useRef, useState } from 'react';

interface FormSelect2Option {
    value: string | number;
    label: string;
}

interface FormSelect2Props {
    label: string;
    options: FormSelect2Option[];
    value: string | number | null;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    id?: string;
}

export default function FormSelect2({
    label,
    options,
    value,
    onChange,
    error,
    placeholder = '-- Pilih Opsi --',
    id,
}: FormSelect2Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Find current selected label
    const selectedOption = options.find((opt) => opt.value.toString() === (value === null ? '' : value.toString()));
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    // Filter options based on search query
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Focus search input when dropdown opens
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Reset search when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setSearch('');
        }
    }, [isOpen]);

    const handleSelect = (val: string | number) => {
        onChange(val.toString());
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef} id={id}>
            <label className="form-label-custom mb-1 font-bold text-xs block">
                {label}
            </label>

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`form-ctrl flex items-center justify-between text-left cursor-pointer bg-white dark:bg-slate-900 border ${
                    error ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                } text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 ${
                    isOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : ''
                } w-full transition-all`}
            >
                <span className="truncate">{displayLabel}</span>
                <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} text-[10px] text-slate-400 shrink-0 ml-2`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-xl overflow-hidden animate-fade-in max-h-72 flex flex-col">
                    {/* Search Field */}
                    <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-1.5 shrink-0">
                        <i className="bi bi-search text-slate-400 text-[10px] ml-1" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Cari..."
                            className="w-full text-xs bg-transparent border-0 p-0 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-0 placeholder-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto p-1.5 space-y-0.5 max-h-52">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value.toString() === (value === null ? '' : value.toString());
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                            isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="text-center py-4 text-slate-400 text-xs">
                                Tidak ada pilihan ditemukan
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-xxs mt-1 font-medium">{error}</p>}
        </div>
    );
}
