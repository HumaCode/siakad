import { useEffect, useState } from 'react';
import FormModal from '@/Components/FormModal';
import FormInput from '@/Components/FormInput';
import FormSelect2 from '@/Components/FormSelect2';
import FormSwitch from '@/Components/FormSwitch';

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
        }
    }, [isOpen, mode, selectedMenu]);

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

                {/* Icon selection with preview */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                        <label className="form-label-custom font-bold text-xs mb-2 block">Ikon Menu (Bootstrap Icons)</label>
                        <div className="flex gap-3 items-center">
                            <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl text-slate-500 shrink-0">
                                {icon ? <i className={`bi ${icon}`} /> : <i className="bi bi-question-circle" />}
                            </div>
                            <div className="flex-1">
                                <FormInput 
                                    label=""
                                    placeholder="cth: bi-shield-check, bi-gear, bi-person-badge" 
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                            Tulis nama kelas ikon dari <a href="https://icons.getbootstrap.com/" target="_blank" rel="noreferrer" className="text-blue-500 underline">Bootstrap Icons</a>
                        </span>
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
