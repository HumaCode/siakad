import { useEffect, useState } from 'react';
import FormModal from '@/Components/FormModal';
import FormInput from '@/Components/FormInput';
import FormSelect2 from '@/Components/FormSelect2';
import FormSwitch from '@/Components/FormSwitch';

const COMMON_ICONS = [
    // Navigation & General Dashboard
    'bi-speedometer2', 'bi-house', 'bi-menu-button-wide', 'bi-list-ul', 'bi-grid', 'bi-compass', 'bi-sliders',
    // Academic / Student / Lecturer / Class
    'bi-mortarboard', 'bi-book', 'bi-journal-text', 'bi-calendar3', 'bi-award', 'bi-check2-square', 'bi-pencil-square', 'bi-chat-dots',
    // Settings, Security & System Management
    'bi-gear', 'bi-wrench', 'bi-tools', 'bi-database', 'bi-shield-lock', 'bi-key', 'bi-shield-check', 'bi-lock', 'bi-unlock',
    // Users & Roles
    'bi-people', 'bi-person', 'bi-person-badge', 'bi-person-gear', 'bi-person-lock', 'bi-person-check', 'bi-person-x',
    // Finance, Stats & Bills
    'bi-cash-coin', 'bi-wallet2', 'bi-credit-card', 'bi-bank', 'bi-bar-chart-line', 'bi-graph-up-arrow', 'bi-activity',
    // Logs, Message alerts & System Infos
    'bi-clock-history', 'bi-bell', 'bi-chat-left-text', 'bi-envelope', 'bi-info-circle', 'bi-question-circle',
    // Files, Documents & Storage
    'bi-file-earmark-text', 'bi-files', 'bi-folder', 'bi-archive', 'bi-cloud-download', 'bi-printer',
];

export interface ParentMenu {
    id: number;
    name: string;
}

export interface PermissionItem {
    id: number;
    name: string;
}

export interface MenuData {
    id?: number;
    name: string;
    url: string;
    category: string;
    icon: string;
    active: boolean;
    orders: number;
    main_menu_id: number | null;
    permissions: number[];
}

interface MenuFormModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    selectedMenu: MenuData | null;
    parentMenus: ParentMenu[];
    permissionsList: PermissionItem[];
    processing: boolean;
    onClose: () => void;
    onSave: (data: MenuData) => void;
}

export default function MenuFormModal({
    isOpen,
    mode,
    selectedMenu,
    parentMenus,
    permissionsList,
    processing,
    onClose,
    onSave,
}: MenuFormModalProps) {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('MAIN MENU');
    const [icon, setIcon] = useState('');
    const [active, setActive] = useState(true);
    const [orders, setOrders] = useState(0);
    const [mainMenuId, setMainMenuId] = useState<number | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    
    // Permission search filter within modal
    const [permSearch, setPermSearch] = useState('');
    const [iconSearch, setIconSearch] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && selectedMenu) {
                setName(selectedMenu.name);
                setUrl(selectedMenu.url);
                setCategory(selectedMenu.category || 'MAIN MENU');
                setIcon(selectedMenu.icon || '');
                setActive(selectedMenu.active);
                setOrders(selectedMenu.orders || 0);
                setMainMenuId(selectedMenu.main_menu_id);
                setSelectedPermissions(selectedMenu.permissions || []);
            } else {
                setName('');
                setUrl('');
                setCategory('MAIN MENU');
                setIcon('');
                setActive(true);
                setOrders(0);
                setMainMenuId(null);
                setSelectedPermissions([]);
            }
            setPermSearch('');
            setIconSearch('');
        }
    }, [isOpen, mode, selectedMenu]);

    const filteredIcons = COMMON_ICONS.filter((ic) => 
        ic.toLowerCase().includes(iconSearch.toLowerCase())
    );

    const handleSubmit = () => {
        onSave({
            name,
            url,
            category,
            icon,
            active,
            orders,
            main_menu_id: mainMenuId,
            permissions: selectedPermissions,
        });
    };

    const togglePermission = (permId: number) => {
        if (selectedPermissions.includes(permId)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permId));
        } else {
            setSelectedPermissions([...selectedPermissions, permId]);
        }
    };

    // Filter permissions based on local search
    const filteredPermissions = permissionsList.filter(perm => 
        perm.name.toLowerCase().includes(permSearch.toLowerCase())
    );

    return (
        <FormModal
            show={isOpen}
            onClose={onClose}
            onSave={handleSubmit}
            processing={processing}
            maxWidth="3xl"
            title={mode === 'add' ? 'Tambah Menu Baru' : `Edit Menu: ${selectedMenu?.name}`}
            subtitle="Konfigurasi navigasi sistem dan hak akses menu"
            saveText={mode === 'add' ? 'Simpan Menu' : 'Simpan Perubahan'}
        >
            <div className="space-y-5">
                {/* Name & URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput 
                        label="Nama Menu" 
                        placeholder="cth: Data Mahasiswa" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <FormInput 
                        label="URL Rute" 
                        placeholder="cth: akademik/mahasiswa" 
                        className="font-mono text-sm"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>

                {/* Category, Parent & Orders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput 
                        label="Kategori Menu" 
                        placeholder="cth: MAIN MENU, SISTEM, KEUANGAN" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    <FormSelect2 
                        label="Parent Menu (Menu Utama)"
                        value={mainMenuId === null ? '' : mainMenuId.toString()}
                        onChange={(val) => {
                            setMainMenuId(val === '' ? null : parseInt(val));
                        }}
                        options={[
                            { value: '', label: '-- Sebagai Menu Utama (Root) --' },
                            ...parentMenus.map(m => ({ value: m.id.toString(), label: m.name })),
                        ]}
                    />

                    <FormInput 
                        type="number"
                        label="Urutan Tampil (Orders)" 
                        min={0}
                        value={orders}
                        onChange={(e) => setOrders(parseInt(e.target.value) || 0)}
                    />
                </div>

                {/* Icon Selection Grid with Preview & Search */}
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="form-label-custom font-bold text-xs mb-2 block">Pilih Ikon Menu</label>
                        
                        {/* Search & Preview Row */}
                        <div className="flex gap-3 items-center mb-3">
                            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500/30 flex flex-col items-center justify-between py-2 text-xl text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
                                {icon ? <i className={`bi ${icon} leading-none`} /> : <i className="bi bi-question-circle leading-none" />}
                                <span className="text-[8px] font-black tracking-widest opacity-60 uppercase leading-none">PREVIEW</span>
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                                    <input 
                                        type="text" 
                                        placeholder="Cari ikon (cth: gear, student, cash)..." 
                                        className="form-ctrl w-full !pl-9 !pr-24 text-xs font-semibold py-2.5" 
                                        value={iconSearch}
                                        onChange={(e) => {
                                            setIconSearch(e.target.value);
                                            if (e.target.value.startsWith('bi-')) {
                                                setIcon(e.target.value);
                                            }
                                        }}
                                    />
                                    {iconSearch && !iconSearch.startsWith('bi-') && (
                                        <button 
                                            type="button"
                                            onClick={() => setIcon(`bi-${iconSearch}`)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-2 py-1 rounded-md transition-colors"
                                        >
                                            Kustom: bi-{iconSearch}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Icon Grid */}
                        <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-3 max-h-48 overflow-y-auto">
                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                {filteredIcons.map((ic) => {
                                    const isSelected = icon === ic;
                                    return (
                                        <button
                                            key={ic}
                                            type="button"
                                            onClick={() => setIcon(ic)}
                                            title={ic}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                                                isSelected 
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105' 
                                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-slate-100 dark:border-slate-800/80'
                                            }`}
                                        >
                                            <i className={`bi ${ic}`} />
                                        </button>
                                    );
                                })}
                                {filteredIcons.length === 0 && (
                                    <div className="col-span-full text-center py-6 text-xs text-slate-400">
                                        Tidak ada ikon yang cocok. Ketik di atas untuk mencari atau klik tombol kustom.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Switch */}
                <FormSwitch 
                    label="Status Aktif"
                    description="Aktifkan agar menu tampil di sidebar navigasi pengguna"
                    checked={active}
                    onChange={setActive}
                />

                {/* Required Permissions Multi-Select Checklist */}
                <div className="bg-slate-50 dark:bg-slate-800/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <div>
                            <label className="form-label-custom font-bold text-xs block mb-0.5">Akses Khusus Permission</label>
                            <span className="text-[10px] text-slate-400">Pengguna harus memiliki minimal salah satu permission ini untuk melihat menu</span>
                        </div>
                        <div className="w-full sm:w-48 shrink-0">
                            <input 
                                type="text"
                                placeholder="Cari permission..."
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={permSearch}
                                onChange={(e) => setPermSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="max-h-40 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-2 border border-slate-200/50 dark:border-slate-800 rounded-lg p-3 bg-white dark:bg-slate-900/40">
                        {filteredPermissions.length > 0 ? (
                            filteredPermissions.map(perm => {
                                const isChecked = selectedPermissions.includes(perm.id);
                                return (
                                    <div 
                                        key={perm.id}
                                        onClick={() => togglePermission(perm.id)}
                                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all border ${
                                            isChecked 
                                                ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/40' 
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/20 border-transparent'
                                        }`}
                                    >
                                        <input 
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {}} // handled by div click
                                            className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer pointer-events-none"
                                        />
                                        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate font-mono">
                                            {perm.name}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                                Tidak ada permission ditemukan
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FormModal>
    );
}
