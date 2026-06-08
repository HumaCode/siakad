<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KalenderAkademik;

class KalenderAkademikSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // PERIODE
            [
                'tahun' => '2026',
                'kategori' => 'periode',
                'jenis' => 'kegiatan',
                'judul' => 'Penerimaan Mahasiswa Baru',
                'deskripsi' => 'Penerimaan Mahasiswa Baru',
                'tanggal_mulai' => '2025-08-01',
                'tanggal_selesai' => '2025-08-31',
                'warna' => 'var(--green)',
                'ikon' => 'bi-person-plus-fill',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'periode',
                'jenis' => 'kegiatan',
                'judul' => 'Registrasi & Pengisian KRS',
                'deskripsi' => 'Periode registrasi dan pengisian KRS bagi mahasiswa',
                'tanggal_mulai' => '2025-09-01',
                'tanggal_selesai' => '2025-09-14',
                'warna' => 'var(--primary)',
                'ikon' => 'bi-journal-check',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'periode',
                'jenis' => 'perkuliahan',
                'judul' => 'Perkuliahan Semester Gasal',
                'deskripsi' => 'Perkuliahan reguler',
                'tanggal_mulai' => '2025-09-15',
                'tanggal_selesai' => '2026-01-15',
                'warna' => 'var(--primary)',
                'ikon' => 'bi-book-fill',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'periode',
                'jenis' => 'ujian',
                'judul' => 'Ujian Tengah Semester',
                'deskripsi' => 'Pelaksanaan UTS',
                'tanggal_mulai' => '2026-06-23',
                'tanggal_selesai' => '2026-06-30',
                'warna' => 'var(--rose)',
                'ikon' => 'bi-clipboard-check',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'periode',
                'jenis' => 'ujian',
                'judul' => 'Ujian Akhir Semester',
                'deskripsi' => 'Pelaksanaan UAS',
                'tanggal_mulai' => '2026-01-13',
                'tanggal_selesai' => '2026-01-20',
                'warna' => 'var(--rose)',
                'ikon' => 'bi-clipboard-check',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'periode',
                'jenis' => 'kegiatan',
                'judul' => 'Input Nilai & Pengolahan',
                'deskripsi' => 'Input nilai oleh dosen dan pengolahan data',
                'tanggal_mulai' => '2026-01-21',
                'tanggal_selesai' => '2026-01-31',
                'warna' => 'var(--purple)',
                'ikon' => 'bi-pencil-square',
            ],

            // AGENDA
            [
                'tahun' => '2026',
                'kategori' => 'agenda',
                'jenis' => 'kegiatan',
                'judul' => 'Batas Pengisian KRS',
                'deskripsi' => 'Perpanjangan batas KRS hingga pukul 23:59',
                'tanggal_mulai' => '2026-06-05',
                'tanggal_selesai' => null,
                'warna' => '#e11d48',
                'ikon' => 'bi-journal-check',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'agenda',
                'jenis' => 'libur',
                'judul' => 'Libur Nasional',
                'deskripsi' => 'Hari Raya Idul Adha 1447 H',
                'tanggal_mulai' => '2026-06-16',
                'tanggal_selesai' => null,
                'warna' => '#f59e0b',
                'ikon' => 'bi-star-fill',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'agenda',
                'jenis' => 'perkuliahan',
                'judul' => 'Kuliah Umum Nasional',
                'deskripsi' => 'Guest lecture bersama praktisi industri tech',
                'tanggal_mulai' => '2026-06-20',
                'tanggal_selesai' => null,
                'warna' => '#0d9488', // teal-600
                'ikon' => 'bi-megaphone-fill',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'agenda',
                'jenis' => 'ujian',
                'judul' => 'Ujian Tengah Semester',
                'deskripsi' => 'UTS Semester Gasal 2025/2026 semua prodi',
                'tanggal_mulai' => '2026-06-23',
                'tanggal_selesai' => '2026-06-30',
                'warna' => '#e11d48',
                'ikon' => 'bi-clipboard2-check-fill',
            ],
            [
                'tahun' => '2026',
                'kategori' => 'agenda',
                'jenis' => 'kegiatan',
                'judul' => 'Input Nilai UTS',
                'deskripsi' => 'Batas akhir input nilai UTS oleh dosen',
                'tanggal_mulai' => '2026-07-07',
                'tanggal_selesai' => null,
                'warna' => '#9333ea', // purple-600
                'ikon' => 'bi-pencil-fill',
            ],
        ];

        foreach ($data as $item) {
            KalenderAkademik::create($item);
        }
    }
}
