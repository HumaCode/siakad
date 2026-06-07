<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\Dosen;

class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $prodiTI = Prodi::where('kode', 'IF')->first();
        $prodiSI = Prodi::where('kode', 'SI')->first();
        $prodiManaj = Prodi::where('kode', 'MAN')->first();

        // Fetch seeded Lecturers
        $dosens = Dosen::all();
        $defaultDosen = $dosens->first();

        $dosenTI = Dosen::where('prodi_id', $prodiTI?->id)->first() ?? $defaultDosen;
        $dosenSI = Dosen::where('prodi_id', $prodiSI?->id)->first() ?? $defaultDosen;

        $courses = [
            [
                'prodi_id' => $prodiTI?->id,
                'kode' => 'TI501',
                'nama' => 'Algoritma & Pemrograman',
                'sks' => 3,
                'sem' => 5,
                'jenis' => 'Wajib',
                'prasyarat' => 'TI302',
                'dosen_id' => $dosenTI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Mata kuliah dasar algoritma dan pemrograman menggunakan bahasa pemrograman tingkat tinggi.',
            ],
            [
                'prodi_id' => $prodiTI?->id,
                'kode' => 'TI502',
                'nama' => 'Basis Data Lanjut',
                'sks' => 3,
                'sem' => 5,
                'jenis' => 'Wajib',
                'prasyarat' => 'TI301',
                'dosen_id' => $dosenTI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Pembahasan mendalam tentang perancangan basis data relasional dan non-relasional.',
            ],
            [
                'prodi_id' => $prodiTI?->id,
                'kode' => 'TI503',
                'nama' => 'Rekayasa Perangkat Lunak',
                'sks' => 3,
                'sem' => 5,
                'jenis' => 'Wajib',
                'prasyarat' => '-',
                'dosen_id' => $dosenTI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Pengenalan siklus hidup pengembangan perangkat lunak (SDLC).',
            ],
            [
                'prodi_id' => $prodiTI?->id,
                'kode' => 'TI504',
                'nama' => 'Jaringan Komputer',
                'sks' => 2,
                'sem' => 5,
                'jenis' => 'Wajib',
                'prasyarat' => '-',
                'dosen_id' => $dosenTI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Konsep dasar jaringan komputer, protokol, dan arsitektur OSI.',
            ],
            [
                'prodi_id' => $prodiTI?->id,
                'kode' => 'TI505',
                'nama' => 'Metode Penelitian',
                'sks' => 2,
                'sem' => 5,
                'jenis' => 'Wajib',
                'prasyarat' => '-',
                'dosen_id' => $dosenTI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Metodologi penelitian ilmiah bidang teknologi informasi.',
            ],
            [
                'prodi_id' => $prodiTI?->id,
                'kode' => 'TI506',
                'nama' => 'Keamanan Siber',
                'sks' => 3,
                'sem' => 5,
                'jenis' => 'Pilihan',
                'prasyarat' => 'TI504',
                'dosen_id' => $dosenTI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Konsep dasar keamanan informasi dan sistem komputer.',
            ],
            [
                'prodi_id' => $prodiSI?->id,
                'kode' => 'SI401',
                'nama' => 'Analisis & Desain Sistem',
                'sks' => 3,
                'sem' => 4,
                'jenis' => 'Wajib',
                'prasyarat' => '-',
                'dosen_id' => $dosenSI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Metodologi analisis dan desain sistem informasi bisnis.',
            ],
            [
                'prodi_id' => $prodiSI?->id,
                'kode' => 'SI402',
                'nama' => 'Manajemen Proyek SI',
                'sks' => 2,
                'sem' => 4,
                'jenis' => 'Wajib',
                'prasyarat' => 'SI301',
                'dosen_id' => $dosenSI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Manajemen proyek pengembangan sistem informasi menggunakan metodologi modern.',
            ],
            [
                'prodi_id' => $prodiManaj?->id,
                'kode' => 'MB301',
                'nama' => 'Manajemen Strategis',
                'sks' => 3,
                'sem' => 3,
                'jenis' => 'Wajib',
                'prasyarat' => '-',
                'dosen_id' => $defaultDosen?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Konsep manajemen strategis dan pengambilan keputusan bisnis tingkat tinggi.',
            ],
            [
                'prodi_id' => $prodiManaj?->id,
                'kode' => 'MB302',
                'nama' => 'Kewirausahaan Digital',
                'sks' => 2,
                'sem' => 3,
                'jenis' => 'Pilihan',
                'prasyarat' => '-',
                'dosen_id' => $defaultDosen?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Pengenalan startup dan kewirausahaan berbasis teknologi digital.',
            ],
            [
                'prodi_id' => $prodiTI?->id,
                'kode' => 'TI507',
                'nama' => 'Machine Learning',
                'sks' => 3,
                'sem' => 7,
                'jenis' => 'Pilihan',
                'prasyarat' => 'TI601',
                'dosen_id' => $dosenTI?->id,
                'status' => 'Nonaktif',
                'deskripsi' => 'Pembelajaran mesin menggunakan Python dan framework modern.',
            ],
            [
                'prodi_id' => $prodiTI?->id,
                'kode' => 'TI508',
                'nama' => 'Pengembangan Aplikasi Mobile',
                'sks' => 3,
                'sem' => 6,
                'jenis' => 'Pilihan',
                'prasyarat' => 'TI501',
                'dosen_id' => $dosenTI?->id,
                'status' => 'Aktif',
                'deskripsi' => 'Pembuatan aplikasi mobile cross-platform menggunakan Flutter / React Native.',
            ],
        ];

        foreach ($courses as $c) {
            if ($c['prodi_id'] && $c['dosen_id']) {
                MataKuliah::create($c);
            }
        }
    }
}
