import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { PageProps } from '@/types/index';

// Animated Counter Component to emulate the jQuery counter animation in siakad-dashboard.html
function AnimatedCounter({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const duration = 1200; // ms
        const stepTime = 16;   // ~60fps
        const totalSteps = duration / stepTime;
        const increment = end / totalSteps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count.toLocaleString('id-ID')}</span>;
}

export default function Dashboard() {
    const user = usePage<PageProps>().props.auth.user;

    // Attendance data for the mini chart
    const attendData = [88, 93, 91, 95, 90];

    // Monthly applicant data for bottom chart
    const monthData = [320, 410, 380, 520, 490, 620];
    const monthColors = [
        'bg-blue-100 dark:bg-blue-900/20',
        'bg-blue-200 dark:bg-blue-800/30',
        'bg-blue-300 dark:bg-blue-700/50',
        'bg-blue-400 dark:bg-blue-600/70',
        'bg-blue-500',
        'bg-blue-600',
    ];

    // Prodi KRS progress bars data
    const prodiKrs = [
        { name: 'Teknik Informatika', value: 96, color: 'from-blue-500 to-indigo-600' },
        { name: 'Sistem Informasi', value: 91, color: 'from-teal-500 to-emerald-600' },
        { name: 'Manajemen Bisnis', value: 84, color: 'from-amber-500 to-orange-500' },
        { name: 'Hukum', value: 78, color: 'from-purple-500 to-pink-500' },
        { name: 'Kedokteran Gigi', value: 62, color: 'from-rose-500 to-red-500' },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
                {/* Modern Backdrop Orbs & Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 -left-20 w-[450px] h-[450px] bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 space-y-6 max-w-7xl mx-auto">
                    {/* Welcome Banner */}
                    <div className="welcome-banner relative overflow-hidden text-white rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-none">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 blur-2xl pointer-events-none" />
                        
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold font-playfair tracking-tight mb-2">
                                    Selamat Datang, {user.name}! 👋
                                </h3>
                                <p className="text-sm text-blue-100 font-medium">
                                    Semester Gasal 2025/2026 · Minggu ke-8 dari 16 pertemuan
                                </p>
                                <div className="flex flex-wrap gap-2.5 mt-5">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                                        <i className="bi bi-calendar3" /> Jumat, 05 Juni 2026
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                                        <i className="bi bi-clock" /> 08:30 WIB
                                    </span>
                                </div>
                            </div>
                            
                            <div className="hidden lg:flex gap-4 shrink-0">
                                <div className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-center backdrop-blur-md min-w-[90px]">
                                    <span className="block text-2xl font-extrabold font-playfair">92%</span>
                                    <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Kehadiran</span>
                                </div>
                                <div className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-center backdrop-blur-md min-w-[90px]">
                                    <span className="block text-2xl font-extrabold font-playfair">38</span>
                                    <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Prodi Aktif</span>
                                </div>
                                <div className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-center backdrop-blur-md min-w-[90px]">
                                    <span className="block text-2xl font-extrabold font-playfair">5</span>
                                    <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Tugas Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {/* Card 1 */}
                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-500 opacity-[0.06] group-hover:scale-125 transition-transform duration-500" />
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-3.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <i className="bi bi-mortarboard-fill" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold font-playfair text-gray-900 dark:text-gray-100 mb-1">
                                <AnimatedCounter value={12480} />
                            </div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Mahasiswa</div>
                            <div className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                <i className="bi bi-arrow-up-short" /> +124 baru
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-teal-500 opacity-[0.06] group-hover:scale-125 transition-transform duration-500" />
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-3.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                                <i className="bi bi-person-badge-fill" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold font-playfair text-gray-900 dark:text-gray-100 mb-1">
                                <AnimatedCounter value={482} />
                            </div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Dosen</div>
                            <div className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                <i className="bi bi-arrow-up-short" /> +8 bulan ini
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-500 opacity-[0.06] group-hover:scale-125 transition-transform duration-500" />
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-3.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                <i className="bi bi-journal-check" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold font-playfair text-gray-900 dark:text-gray-100 mb-1">
                                <AnimatedCounter value={11247} />
                            </div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">KRS Disetujui</div>
                            <div className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                <i className="bi bi-arrow-up-short" /> +98.2%
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-rose-500 opacity-[0.06] group-hover:scale-125 transition-transform duration-500" />
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-3.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                                <i className="bi bi-exclamation-circle-fill" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold font-playfair text-gray-900 dark:text-gray-100 mb-1">
                                <AnimatedCounter value={143} />
                            </div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">KRS Pending</div>
                            <div className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                <i className="bi bi-arrow-down-short" /> +perlu review
                            </div>
                        </div>

                        {/* Card 5 */}
                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-purple-500 opacity-[0.06] group-hover:scale-125 transition-transform duration-500" />
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-3.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                <i className="bi bi-cash-coin" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold font-playfair text-gray-900 dark:text-gray-100 mb-1">
                                <AnimatedCounter value={9821} />
                            </div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Lunas SPP</div>
                            <div className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                <i className="bi bi-arrow-up-short" /> +78.7%
                            </div>
                        </div>

                        {/* Card 6 */}
                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-emerald-500 opacity-[0.06] group-hover:scale-125 transition-transform duration-500" />
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-3.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <i className="bi bi-building-fill-check" />
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold font-playfair text-gray-900 dark:text-gray-100 mb-1">
                                <AnimatedCounter value={38} />
                            </div>
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Program Studi</div>
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">
                                <i className="bi bi-check-circle-fill" /> Semua aktif
                            </div>
                        </div>
                    </div>

                    {/* Main Grid: Three Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Jadwal Hari Ini */}
                        <div className="lg:col-span-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <i className="bi bi-calendar2-week text-blue-600 dark:text-blue-400" /> Jadwal Hari Ini
                                </span>
                                <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                    Lihat Semua →
                                </a>
                            </div>
                            
                            <div className="p-5 divide-y divide-gray-100 dark:divide-gray-700/40 space-y-3.5 [&>div]:pt-3.5 first: [&>div]:pt-0">
                                {/* Subject 1 */}
                                <div className="flex items-center gap-4 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 rounded-xl p-1 transition-all duration-200">
                                    <div className="w-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold text-center py-2 px-1 rounded-lg shrink-0 leading-tight">
                                        07:00<br/>08:40
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                            Algoritma & Pemrograman
                                        </div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                            <i className="bi bi-door-open mr-1" /> R.304 · Dr. Budi S., M.Kom
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                        Selesai
                                    </span>
                                </div>

                                {/* Subject 2 */}
                                <div className="flex items-center gap-4 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 rounded-xl p-1 transition-all duration-200">
                                    <div className="w-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold text-center py-2 px-1 rounded-lg shrink-0 leading-tight">
                                        08:40<br/>10:20
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                            Basis Data Lanjut
                                        </div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                            <i className="bi bi-door-open mr-1" /> Lab TI · Dr. Rina W., M.T
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 animate-pulse">
                                        Berlangsung
                                    </span>
                                </div>

                                {/* Subject 3 */}
                                <div className="flex items-center gap-4 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 rounded-xl p-1 transition-all duration-200">
                                    <div className="w-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold text-center py-2 px-1 rounded-lg shrink-0 leading-tight">
                                        10:30<br/>12:10
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                            Rekayasa Perangkat Lunak
                                        </div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                            <i className="bi bi-door-open mr-1" /> R.205 · Drs. Hendra, M.Cs
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                                        Menunggu
                                    </span>
                                </div>

                                {/* Subject 4 */}
                                <div className="flex items-center gap-4 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 rounded-xl p-1 transition-all duration-200">
                                    <div className="w-16 bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 text-[10px] font-bold text-center py-2 px-1 rounded-lg shrink-0 leading-tight border border-gray-100 dark:border-gray-700/30">
                                        13:00<br/>14:40
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                            Jaringan Komputer
                                        </div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                            <i className="bi bi-door-open mr-1" /> Lab Jaringan · Ir. Surya, M.T
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                        Menunggu
                                    </span>
                                </div>

                                {/* Subject 5 */}
                                <div className="flex items-center gap-4 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 rounded-xl p-1 transition-all duration-200">
                                    <div className="w-16 bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 text-[10px] font-bold text-center py-2 px-1 rounded-lg shrink-0 leading-tight border border-gray-100 dark:border-gray-700/30">
                                        15:00<br/>16:40
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                            Metode Penelitian
                                        </div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                            <i className="bi bi-door-open mr-1" /> R.101 · Prof. Agus M., Ph.D
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                        Menunggu
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links + Mini Chart */}
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            {/* Quick Links */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <span className="block font-bold text-sm text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <i className="bi bi-lightning-charge-fill text-warning" /> Akses Cepat
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-850/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-900/40 hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer group">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-200">
                                            <i className="bi bi-journal-plus" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Input KRS</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-850/50 hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-200 dark:hover:border-teal-900/40 hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer group">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform duration-200">
                                            <i className="bi bi-clipboard2-check" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Absensi</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-850/50 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-200 dark:hover:border-amber-900/40 hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer group">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform duration-200">
                                            <i className="bi bi-bar-chart-line" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Nilai</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-850/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900/40 hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer group">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform duration-200">
                                            <i className="bi bi-wallet2" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">SPP</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-850/50 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-200 dark:hover:border-purple-900/40 hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer group">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform duration-200">
                                            <i className="bi bi-file-earmark-pdf" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Transkrip</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-850/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer group">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:scale-105 transition-transform duration-200">
                                            <i className="bi bi-gear" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Setting</span>
                                    </div>
                                </div>
                            </div>

                            {/* Kehadiran per Hari */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col justify-between">
                                <span className="block font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <i className="bi bi-graph-up-arrow text-green-600 dark:text-green-400" /> Kehadiran Minggu Ini
                                </span>
                                
                                <div className="flex items-end gap-2.5 h-20 pt-4 px-2">
                                    {attendData.map((val, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                                            <div
                                                className={`w-full rounded-t-md transition-all duration-1000 ${
                                                    i === 4
                                                        ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-500/20'
                                                        : 'bg-blue-100 dark:bg-blue-950/40 hover:bg-blue-300 dark:hover:bg-blue-900/60'
                                                }`}
                                                style={{ height: `${val * 0.7}px` }}
                                                title={`${val}%`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2.5 px-2 mt-1">
                                    <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Sen</span>
                                    <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Sel</span>
                                    <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Rab</span>
                                    <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Kam</span>
                                    <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Jum</span>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700/40 pt-3 mt-3">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Rata-rata minggu ini</span>
                                    <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">91.4%</span>
                                </div>
                            </div>
                        </div>

                        {/* Activity Feed + Notices */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* Activity log */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <i className="bi bi-activity text-blue-600 dark:text-blue-400" /> Aktivitas Terkini
                                    </span>
                                    <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Semua →
                                    </a>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-start">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            <i className="bi bi-journal-check" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold leading-relaxed">
                                                <strong className="text-gray-900 dark:text-white font-bold">Budi Santoso</strong> mengajukan KRS Sem. Gasal 2025/2026
                                            </p>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                                <i className="bi bi-clock" /> 2 menit lalu
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-start">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                            <i className="bi bi-check-circle-fill" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold leading-relaxed">
                                                <strong className="text-gray-900 dark:text-white font-bold">Dr. Rina W.</strong> menyetujui 32 KRS mahasiswa
                                            </p>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                                <i className="bi bi-clock" /> 15 menit lalu
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-start">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                            <i className="bi bi-cash" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold leading-relaxed">
                                                <strong className="text-gray-900 dark:text-white font-bold">Siti Rahayu</strong> melunasi SPP Rp 4.200.000
                                            </p>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                                <i className="bi bi-clock" /> 42 menit lalu
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pengumuman */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <span className="block font-bold text-sm text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <i className="bi bi-megaphone-fill text-warning" /> Pengumuman
                                </span>
                                
                                <div className="space-y-3.5">
                                    <div className="flex gap-3 items-start group cursor-pointer hover:bg-gray-500/5 p-1 rounded-lg transition-colors duration-200">
                                        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-0.5">
                                                Batas Pengisian KRS Diperpanjang
                                            </div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
                                                Batas akhir pengisian KRS diperpanjang hingga 10 Juni 2026.
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-gray-400 font-bold shrink-0">Hari ini</span>
                                    </div>

                                    <div className="flex gap-3 items-start group cursor-pointer hover:bg-gray-500/5 p-1 rounded-lg transition-colors duration-200">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-0.5">
                                                Jadwal UTS Semester Gasal
                                            </div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
                                                UTS dilaksanakan 23–30 Juni 2026. Mohon persiapkan ruangan.
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-gray-400 font-bold shrink-0">Kemarin</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Progress & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Progres Akademik per Prodi */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <span className="block font-bold text-sm text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <i className="bi bi-diagram-3-fill text-blue-600 dark:text-blue-400" /> Pengisian KRS per Prodi
                            </span>
                            
                            <div className="space-y-4">
                                {prodiKrs.map((item, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-semibold">
                                            <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">{item.value}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status Pembayaran SPP */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                            <span className="block font-bold text-sm text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <i className="bi bi-pie-chart-fill text-green-600 dark:text-green-400" /> Status Pembayaran SPP
                            </span>
                            
                            <div className="flex items-center justify-center py-2 relative">
                                <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90">
                                    <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="3.5" />
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.9"
                                        fill="none"
                                        className="stroke-blue-600 dark:stroke-blue-500"
                                        strokeWidth="3.5"
                                        strokeDasharray="78.7 21.3"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.9"
                                        fill="none"
                                        className="stroke-amber-500"
                                        strokeWidth="3.5"
                                        strokeDasharray="12.1 87.9"
                                        strokeDashoffset="-78.7"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.9"
                                        fill="none"
                                        className="stroke-rose-500"
                                        strokeWidth="3.5"
                                        strokeDasharray="9.2 90.8"
                                        strokeDashoffset="-90.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="font-['Playfair_Display'] text-xl font-extrabold text-gray-900 dark:text-gray-100 leading-none">78.7%</span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Lunas</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 text-center mt-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100/30 p-2.5 rounded-xl">
                                    <div className="font-['Playfair_Display'] text-sm font-extrabold text-blue-600 dark:text-blue-400">9.821</div>
                                    <div className="text-[9px] text-blue-500 font-bold uppercase mt-0.5">Lunas</div>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100/30 p-2.5 rounded-xl">
                                    <div className="font-['Playfair_Display'] text-sm font-extrabold text-amber-600 dark:text-amber-400">1.512</div>
                                    <div className="text-[9px] text-amber-500 font-bold uppercase mt-0.5">Cicilan</div>
                                </div>
                                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100/30 p-2.5 rounded-xl">
                                    <div className="font-['Playfair_Display'] text-sm font-extrabold text-rose-600 dark:text-rose-400">1.147</div>
                                    <div className="text-[9px] text-rose-500 font-bold uppercase mt-0.5">Belum</div>
                                </div>
                            </div>

                            <div className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-4">
                                Total penerimaan: <span className="text-gray-900 dark:text-white font-extrabold">Rp 41.2 Miliar</span>
                            </div>
                        </div>

                        {/* Mahasiswa Baru per Bulan */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                            <span className="block font-bold text-sm text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <i className="bi bi-person-plus-fill text-blue-600 dark:text-blue-400" /> Pendaftar Baru (2026)
                            </span>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl text-white shadow-sm shadow-blue-500/10">
                                    <span className="text-[9px] opacity-75 font-bold uppercase tracking-wider block mb-1">Total Pendaftar</span>
                                    <span className="font-['Playfair_Display'] text-xl font-extrabold block">3.241</span>
                                    <span className="text-[9px] opacity-70 font-semibold block mt-1">Semester ini</span>
                                </div>
                                <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-3 rounded-xl text-white shadow-sm shadow-teal-500/10">
                                    <span className="text-[9px] opacity-75 font-bold uppercase tracking-wider block mb-1">Diterima</span>
                                    <span className="font-['Playfair_Display'] text-xl font-extrabold block">2.891</span>
                                    <span className="text-[9px] opacity-70 font-semibold block mt-1">89.2% Accepted</span>
                                </div>
                            </div>

                            <div className="flex items-end gap-1.5 h-20 pt-4 px-2">
                                {monthData.map((val, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t-md transition-all duration-1000 ${monthColors[i]}`}
                                        style={{ height: `${(val / 620) * 70}px` }}
                                        title={`${val} pendaftar`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-1.5 px-2 mt-1">
                                <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Jan</span>
                                <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Feb</span>
                                <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Mar</span>
                                <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Apr</span>
                                <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Mei</span>
                                <span className="flex-1 text-center text-[9px] font-bold text-gray-400">Jun</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
