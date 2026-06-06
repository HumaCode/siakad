import React, { useState } from 'react';

interface EventItem {
    title: string;
    color: string;
}

interface TimelineItem {
    date: string;
    title: string;
    desc: string;
    color: string;
    icon: string;
}

interface PeriodItem {
    label: string;
    start: string;
    end: string;
    pct: number;
    color: string;
}

interface KalenderTabProps {
    onOpenModal: () => void;
    onToast: (msg: string) => void;
}

const calEvents: Record<string, EventItem[]> = {
    '2026-06-05': [{ title: 'KRS Deadline', color: '#e11d48' }],
    '2026-06-09': [{ title: 'Batas KRS', color: '#e11d48' }],
    '2026-06-10': [{ title: 'Libur Nasional', color: '#f59e0b' }],
    '2026-06-15': [{ title: 'Perkuliahan', color: '#1a56db' }, { title: 'Seminar IT', color: '#16a34a' }],
    '2026-06-20': [{ title: 'Kuliah Umum', color: '#7c3aed' }],
    '2026-06-23': [{ title: 'UTS Mulai', color: '#e11d48' }],
    '2026-06-24': [{ title: 'UTS', color: '#e11d48' }],
    '2026-06-25': [{ title: 'UTS', color: '#e11d48' }],
    '2026-06-26': [{ title: 'UTS', color: '#e11d48' }],
    '2026-06-27': [{ title: 'UTS', color: '#e11d48' }],
    '2026-06-30': [{ title: 'UTS Selesai', color: '#e11d48' }],
};

const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const timelineEvents: TimelineItem[] = [
    { date: '05 Jun 2026', title: 'Batas Pengisian KRS', desc: 'Perpanjangan batas KRS hingga pukul 23:59', color: 'var(--rose)', icon: 'bi-journal-check' },
    { date: '10 Jun 2026', title: 'Libur Nasional', desc: 'Hari Raya Idul Adha 1447 H', color: 'var(--accent)', icon: 'bi-star-fill' },
    { date: '20 Jun 2026', title: 'Kuliah Umum Nasional', desc: 'Guest lecture bersama praktisi industri tech', color: 'var(--teal)', icon: 'bi-megaphone-fill' },
    { date: '23–30 Jun', title: 'Ujian Tengah Semester', desc: 'UTS Semester Gasal 2025/2026 semua prodi', color: 'var(--rose)', icon: 'bi-clipboard2-check-fill' },
    { date: '7 Jul 2026', title: 'Input Nilai UTS', desc: 'Batas akhir input nilai UTS oleh dosen', color: 'var(--purple)', icon: 'bi-pencil-fill' },
];

const periods: PeriodItem[] = [
    { label: 'Penerimaan Mahasiswa Baru', start: '1 Agt', end: '31 Agt 2025', pct: 100, color: 'var(--green)' },
    { label: 'Registrasi & Pengisian KRS', start: '1 Sep', end: '14 Sep 2025', pct: 100, color: 'var(--primary)' },
    { label: 'Perkuliahan Semester Gasal', start: '15 Sep 2025', end: '15 Jan 2026', pct: 52, color: 'var(--primary)' },
    { label: 'Ujian Tengah Semester', start: '23 Jun', end: '30 Jun 2026', pct: 0, color: 'var(--rose)' },
    { label: 'Ujian Akhir Semester', start: '13 Jan', end: '20 Jan 2026', pct: 0, color: 'var(--rose)' },
    { label: 'Input Nilai & Pengolahan', start: '21 Jan', end: '31 Jan 2026', pct: 0, color: 'var(--purple)' },
];

export default function KalenderTab({ onOpenModal, onToast }: KalenderTabProps) {
    const [year, setYear] = useState(2026);
    const [month, setMonth] = useState(5); // June is 5 (0-indexed)

    const changeMonth = (dir: number) => {
        let newMonth = month + dir;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setMonth(newMonth);
        setYear(newYear);
    };

    const goToday = () => {
        setYear(2026);
        setMonth(5);
    };

    // Calendar generation
    const getCalendarDays = () => {
        const daysArray = [];
        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();
        const today = new Date();

        let dayCount = 1;
        let nextDay = 1;

        for (let i = 0; i < 42; i++) {
            let displayDay = 0;
            let isOther = false;
            let dateKey = '';

            if (i < firstDayIndex) {
                displayDay = prevLastDate - (firstDayIndex - 1 - i);
                isOther = true;
                const m = month === 0 ? 11 : month - 1;
                const y = month === 0 ? year - 1 : year;
                dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`;
            } else if (dayCount > lastDate) {
                displayDay = nextDay++;
                isOther = true;
                const m = month === 11 ? 0 : month + 1;
                const y = month === 11 ? year + 1 : year;
                dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`;
            } else {
                displayDay = dayCount;
                dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`;
                dayCount++;
            }

            const isToday = !isOther &&
                displayDay === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            daysArray.push({
                displayDay,
                isOther,
                isToday,
                dateKey
            });
        }
        return daysArray;
    };

    const calendarDays = getCalendarDays();

    const handleDayClick = (day: any) => {
        const events = calEvents[day.dateKey] || [];
        const eventText = events.length > 0 ? `: ${events[0].title}` : '';
        onToast(`${day.displayDay} ${monthNames[month]} ${year}${eventText}`);
    };

    return (
        <div className="tab-panel active">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Calendar Grid */}
                <div className="col-span-1 lg:col-span-8">
                    <div className="card-custom">
                        {/* Month Nav */}
                        <div className="p-5 flex flex-wrap items-center justify-between border-b border-slate-100 dark:border-slate-800/40">
                            <div>
                                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                                    {monthNames[month]} {year}
                                </div>
                                <div className="text-xs text-slate-400">
                                    Semester Gasal 2025/2026
                                </div>
                            </div>
                            <div className="flex gap-1.5 items-center">
                                <button
                                    className="btn-icon bi-view cursor-pointer"
                                    style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
                                    onClick={() => changeMonth(-1)}
                                >
                                    <i className="bi bi-chevron-left" />
                                </button>
                                <button
                                    className="btn-add cursor-pointer text-xs py-1 px-3"
                                    onClick={goToday}
                                >
                                    Hari Ini
                                </button>
                                <button
                                    className="btn-icon bi-view cursor-pointer"
                                    style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
                                    onClick={() => changeMonth(1)}
                                >
                                    <i className="bi bi-chevron-right" />
                                </button>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="px-5 pt-3 pb-1 flex gap-3 flex-wrap">
                            <span className="text-[10px] font-bold flex items-center gap-1">
                                <span className="w-2 h-2 rounded bg-blue-600 inline-block" /> Perkuliahan
                            </span>
                            <span className="text-[10px] font-bold flex items-center gap-1">
                                <span className="w-2 h-2 rounded bg-rose-600 inline-block" /> Ujian
                            </span>
                            <span className="text-[10px] font-bold flex items-center gap-1">
                                <span className="w-2 h-2 rounded bg-amber-500 inline-block" /> Libur
                            </span>
                            <span className="text-[10px] font-bold flex items-center gap-1">
                                <span className="w-2 h-2 rounded bg-green-600 inline-block" /> Kegiatan
                            </span>
                        </div>

                        {/* Calendar Grid Table */}
                        <div className="p-5">
                            {/* Day Headers */}
                            <div className="cal-grid mb-1">
                                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((h) => (
                                    <div key={h} className="cal-day-header">{h}</div>
                                ))}
                            </div>
                            {/* Calendar Days */}
                            <div className="cal-grid">
                                {calendarDays.map((day, idx) => {
                                    const dayEvents = calEvents[day.dateKey] || [];
                                    const hasEvents = dayEvents.length > 0;

                                    return (
                                        <div
                                            key={idx}
                                            className={`cal-day ${day.isOther ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${hasEvents ? 'has-event' : ''}`}
                                            onClick={() => handleDayClick(day)}
                                        >
                                            <div className="cal-num">{day.displayDay}</div>
                                            {dayEvents.slice(0, 2).map((ev, eIdx) => (
                                                <div
                                                    key={eIdx}
                                                    className="cal-event"
                                                    style={{
                                                        backgroundColor: ev.color + '22',
                                                        color: ev.color
                                                    }}
                                                >
                                                    {ev.title}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agenda & Period timeline */}
                <div className="col-span-1 lg:col-span-4">
                    {/* Upcoming events */}
                    <div className="card-custom mb-3 p-4">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                <i className="bi bi-calendar-event-fill text-blue-600 me-2" /> Agenda Mendatang
                            </span>
                            <button className="btn-add cursor-pointer text-xs py-1 px-3" onClick={onOpenModal}>
                                <i className="bi bi-plus-lg" /> Tambah
                            </button>
                        </div>
                        <div className="flex flex-col">
                            {timelineEvents.map((ev, idx) => (
                                <div key={idx} className="timeline-item">
                                    <div className="tl-dot-wrap">
                                        <div
                                            className="tl-dot"
                                            style={{
                                                borderColor: ev.color,
                                                backgroundColor: ev.color
                                            }}
                                        />
                                        {idx < timelineEvents.length - 1 && <div className="tl-line" />}
                                    </div>
                                    <div className="tl-content">
                                        <div className="tl-date text-[10px] font-bold" style={{ color: ev.color }}>
                                            <i className={`bi ${ev.icon} me-1`} /> {ev.date}
                                        </div>
                                        <div className="tl-title text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                            {ev.title}
                                        </div>
                                        <div className="tl-desc text-[10px] text-slate-400">
                                            {ev.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Academic Periods */}
                    <div className="card-custom p-4">
                        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-3">
                            <i className="bi bi-clock-history text-green-600 me-2" /> Periode Akademik
                        </div>
                        <div className="flex flex-col gap-3">
                            {periods.map((p, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                            {p.label}
                                        </span>
                                        <span className="text-[9px] text-slate-400">
                                            {p.start}–{p.end}
                                        </span>
                                    </div>
                                    <div className="prog-bar-bg">
                                        <div
                                            className="prog-bar-fill"
                                            style={{
                                                width: `${p.pct}%`,
                                                backgroundColor: p.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
