<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JadwalKuliah;
use App\Models\MataKuliah;
use App\Models\Ruangan;
use App\Models\Dosen;

class JadwalKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $ruangB201 = Ruangan::where('nama_ruangan', 'like', '%B201%')->first() ?? Ruangan::first();
        $ruangB202 = Ruangan::where('nama_ruangan', 'like', '%B202%')->first() ?? Ruangan::first();
        $ruangC102 = Ruangan::where('nama_ruangan', 'like', '%C102%')->first() ?? Ruangan::first();
        $ruangC103 = Ruangan::where('nama_ruangan', 'like', '%C103%')->first() ?? Ruangan::first();

        // Fetch courses by code to map them correctly
        $mkAlgo = MataKuliah::where('kode', 'TI501')->first();
        $mkDb = MataKuliah::where('kode', 'TI502')->first();
        $mkRpl = MataKuliah::where('kode', 'TI503')->first();
        $mkJarkom = MataKuliah::where('kode', 'TI504')->first();
        $mkMetpen = MataKuliah::where('kode', 'TI505')->first();
        $mkCyber = MataKuliah::where('kode', 'TI506')->first();
        $mkMobile = MataKuliah::where('kode', 'TI508')->first();

        // Management (MB)
        $mkStrat = MataKuliah::where('kode', 'MB301')->first();
        $mkKewirausahaan = MataKuliah::where('kode', 'MB302')->first();

        // Information Systems (SI)
        $mkSistem = MataKuliah::where('kode', 'SI401')->first();
        $mkProyek = MataKuliah::where('kode', 'SI402')->first();

        $schedules = [
            // --- Teknik Informatika (Semester 5) ---
            [
                'mata_kuliah' => $mkAlgo,
                'hari' => 'Senin',
                'jam_mulai' => '07:00',
                'jam_selesai' => '08:40',
                'ruangan' => $ruangC102,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkDb,
                'hari' => 'Senin',
                'jam_mulai' => '08:40',
                'jam_selesai' => '10:20',
                'ruangan' => $ruangB201,
                'tipe' => 'Praktikum',
            ],
            [
                'mata_kuliah' => $mkMetpen,
                'hari' => 'Senin',
                'jam_mulai' => '13:00',
                'jam_selesai' => '14:40',
                'ruangan' => $ruangC103,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkJarkom,
                'hari' => 'Selasa',
                'jam_mulai' => '07:00',
                'jam_selesai' => '08:40',
                'ruangan' => $ruangB202,
                'tipe' => 'Praktikum',
            ],
            [
                'mata_kuliah' => $mkRpl,
                'hari' => 'Selasa',
                'jam_mulai' => '10:20',
                'jam_selesai' => '12:00',
                'ruangan' => $ruangC102,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkMobile,
                'hari' => 'Selasa',
                'jam_mulai' => '14:40',
                'jam_selesai' => '16:20',
                'ruangan' => $ruangB201,
                'tipe' => 'Praktikum',
            ],
            [
                'mata_kuliah' => $mkMetpen,
                'hari' => 'Rabu',
                'jam_mulai' => '07:00',
                'jam_selesai' => '08:40',
                'ruangan' => $ruangC103,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkDb,
                'hari' => 'Rabu',
                'jam_mulai' => '10:20',
                'jam_selesai' => '12:00',
                'ruangan' => $ruangB201,
                'tipe' => 'Praktikum',
            ],
            [
                'mata_kuliah' => $mkCyber,
                'hari' => 'Rabu',
                'jam_mulai' => '13:00',
                'jam_selesai' => '14:40',
                'ruangan' => $ruangC102,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkRpl,
                'hari' => 'Kamis',
                'jam_mulai' => '08:40',
                'jam_selesai' => '10:20',
                'ruangan' => $ruangC103,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkCyber,
                'hari' => 'Kamis',
                'jam_mulai' => '10:20',
                'jam_selesai' => '12:00',
                'ruangan' => $ruangB201,
                'tipe' => 'Praktikum',
            ],
            [
                'mata_kuliah' => $mkAlgo,
                'hari' => 'Kamis',
                'jam_mulai' => '14:40',
                'jam_selesai' => '16:20',
                'ruangan' => $ruangB201,
                'tipe' => 'Praktikum',
            ],
            [
                'mata_kuliah' => $mkAlgo,
                'hari' => 'Jumat',
                'jam_mulai' => '08:40',
                'jam_selesai' => '10:20',
                'ruangan' => $ruangC102,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkJarkom,
                'hari' => 'Jumat',
                'jam_mulai' => '13:00',
                'jam_selesai' => '14:40',
                'ruangan' => $ruangC103,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkRpl,
                'hari' => 'Jumat',
                'jam_mulai' => '16:20',
                'jam_selesai' => '18:00',
                'ruangan' => $ruangC102,
                'tipe' => 'Studio',
            ],

            // --- Manajemen (Semester 3) ---
            [
                'mata_kuliah' => $mkStrat,
                'hari' => 'Senin',
                'jam_mulai' => '08:40',
                'jam_selesai' => '10:20',
                'ruangan' => $ruangC102,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkKewirausahaan,
                'hari' => 'Rabu',
                'jam_mulai' => '10:20',
                'jam_selesai' => '12:00',
                'ruangan' => $ruangC103,
                'tipe' => 'Teori',
            ],

            // --- Sistem Informasi (Semester 4) ---
            [
                'mata_kuliah' => $mkSistem,
                'hari' => 'Selasa',
                'jam_mulai' => '07:00',
                'jam_selesai' => '08:40',
                'ruangan' => $ruangC102,
                'tipe' => 'Teori',
            ],
            [
                'mata_kuliah' => $mkProyek,
                'hari' => 'Kamis',
                'jam_mulai' => '10:20',
                'jam_selesai' => '12:00',
                'ruangan' => $ruangB201,
                'tipe' => 'Teori',
            ],
        ];

        foreach ($schedules as $s) {
            $mk = $s['mata_kuliah'];
            $room = $s['ruangan'];
            if ($mk && $room) {
                $kelas = \App\Models\Kelas::where('prodi_id', $mk->prodi_id)->first();

                JadwalKuliah::create([
                    'mata_kuliah_id' => $mk->id,
                    'ruangan_id' => $room->id,
                    'dosen_id' => $mk->dosen_id,
                    'prodi_id' => $mk->prodi_id,
                    'hari' => $s['hari'],
                    'kelas_id' => $kelas?->id,
                    'jam_mulai' => $s['jam_mulai'],
                    'jam_selesai' => $s['jam_selesai'],
                    'tipe' => $s['tipe'],
                ]);
            }
        }
    }
}
