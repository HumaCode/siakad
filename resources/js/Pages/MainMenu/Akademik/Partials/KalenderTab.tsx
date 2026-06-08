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

interface KalenderItem {
    id: string;
    tahun: string;
    kategori: string;
    jenis: string;
    judul: string;
    deskripsi: string;
    tanggal_mulai: string;
    tanggal_selesai: string | null;
    warna: string;
    ikon: string;
}

interface KalenderTabProps {
    kalender: KalenderItem[];
    tahun?: string | null;
    onOpenModal: () => void;
    onToast: (msg: string) => void;
}

const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function KalenderTab({ kalender, tahun, onOpenModal, onToast }: KalenderTabProps) {
    const defaultYear = tahun ? parseInt(tahun) : new Date().getFullYear();
    const [year, setYear] = useState(defaultYear);
    const [month, setMonth] = useState(new Date().getMonth()); // Default to current month

    useEffect(() => {
        if (tahun) {
            setYear(parseInt(tahun));
        }
    }, [tahun]);

    // Process kalender data
    const calEvents: Record<string, EventItem[]> = {};
    const timelineEvents: TimelineItem[] = [];
    const periods: PeriodItem[] = [];

    const todayDate = new Date();

    kalender.forEach((k) => {
        if (k.kategori === 'agenda') {
            if (!calEvents[k.tanggal_mulai]) {
                calEvents[k.tanggal_mulai] = [];
            }
            // For agenda that spans multiple days, we might want to populate calEvents for each day
            // But for simplicity, we map start to start date.
            let startD = new Date(k.tanggal_mulai);
            let endD = k.tanggal_selesai ? new Date(k.tanggal_selesai) : startD;
            
            // Loop through dates
            let currD = new Date(startD);
            while (currD <= endD) {
                const dStr = `${currD.getFullYear()}-${String(currD.getMonth() + 1).padStart(2, '0')}-${String(currD.getDate()).padStart(2, '0')}`;
                if (!calEvents[dStr]) calEvents[dStr] = [];
                calEvents[dStr].push({ title: k.judul, color: k.warna || '#e11d48' });
                currD.setDate(currD.getDate() + 1);
            }
            
            const formattedDate = `${startD.getDate()} ${monthNames[startD.getMonth()].substring(0, 3)} ${startD.getFullYear()}`;
            
            timelineEvents.push({
                date: k.tanggal_selesai && startD.getTime() !== endD.getTime() 
                    ? `${startD.getDate()} ${monthNames[startD.getMonth()].substring(0, 3)} - ${endD.getDate()} ${monthNames[endD.getMonth()].substring(0, 3)}`
                    : formattedDate,
                title: k.judul,
                desc: k.deskripsi || '',
                color: k.warna || 'var(--rose)',
                icon: k.ikon || 'bi-calendar-event'
            });
        } else if (k.kategori === 'periode') {
            const startObj = new Date(k.tanggal_mulai);
            let endObj = k.tanggal_selesai ? new Date(k.tanggal_selesai) : startObj;
            
            let pct = 0;
            if (todayDate > endObj) pct = 100;
            else if (todayDate >= startObj && todayDate <= endObj) {
                const totalDur = endObj.getTime() - startObj.getTime();
                const passed = todayDate.getTime() - startObj.getTime();
                pct = Math.round((passed / totalDur) * 100);
            }

            periods.push({
                label: k.judul,
                start: `${startObj.getDate()} ${monthNames[startObj.getMonth()].substring(0, 3)}`,
                end: `${endObj.getDate()} ${monthNames[endObj.getMonth()].substring(0, 3)} ${endObj.getFullYear()}`,
                pct: pct,
                color: k.warna || 'var(--primary)'
            });
        }
    });

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
                                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((h, i) => (
                                    <div key={h} className={`cal-day-header ${i === 0 ? 'text-rose-500 font-extrabold' : ''}`}>{h}</div>
                                ))}
                            </div>
                            {/* Calendar Days */}
                            <div className="cal-grid">
                                {calendarDays.map((day, idx) => {
                                    const dayEvents = calEvents[day.dateKey] || [];
                                    const hasEvents = dayEvents.length > 0;
                                    const isSunday = new Date(day.dateKey).getDay() === 0;

                                    return (
                                        <div
                                            key={idx}
                                            className={`cal-day ${day.isOther ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${hasEvents ? 'has-event' : ''}`}
                                            onClick={() => handleDayClick(day)}
                                        >
                                            <div className={`cal-num ${isSunday && !day.isOther ? 'text-rose-600 font-bold' : ''}`}>{day.displayDay}</div>
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
