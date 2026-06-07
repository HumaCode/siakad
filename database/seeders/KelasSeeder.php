<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kelas;
use App\Models\Prodi;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        $prodiTI = Prodi::where('kode', 'IF')->first();
        $prodiSI = Prodi::where('kode', 'SI')->first();
        $prodiManaj = Prodi::where('kode', 'MAN')->first();

        // Seed classes for Teknik Informatika
        if ($prodiTI) {
            Kelas::create(['prodi_id' => $prodiTI->id, 'nama' => 'Kelas A', 'status' => 'Aktif']);
            Kelas::create(['prodi_id' => $prodiTI->id, 'nama' => 'Kelas B', 'status' => 'Aktif']);
            Kelas::create(['prodi_id' => $prodiTI->id, 'nama' => 'Kelas C', 'status' => 'Aktif']);
            Kelas::create(['prodi_id' => $prodiTI->id, 'nama' => 'Kelas Eksekutif', 'status' => 'Aktif']);
        }

        // Seed classes for Sistem Informasi
        if ($prodiSI) {
            Kelas::create(['prodi_id' => $prodiSI->id, 'nama' => 'Kelas Reguler A', 'status' => 'Aktif']);
            Kelas::create(['prodi_id' => $prodiSI->id, 'nama' => 'Kelas Reguler B', 'status' => 'Aktif']);
        }

        // Seed classes for Manajemen
        if ($prodiManaj) {
            Kelas::create(['prodi_id' => $prodiManaj->id, 'nama' => 'Kelas A', 'status' => 'Aktif']);
            Kelas::create(['prodi_id' => $prodiManaj->id, 'nama' => 'Kelas B', 'status' => 'Aktif']);
        }
    }
}
