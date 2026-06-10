<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DosenResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hariOrder = ['Senin' => 1, 'Selasa' => 2, 'Rabu' => 3, 'Kamis' => 4, 'Jumat' => 5, 'Sabtu' => 6];

        // Ensure relations are loaded safely
        $sks = $this->relationLoaded('mataKuliahs') ? $this->mataKuliahs->sum('sks') : 0;
        $keahlian = $this->relationLoaded('mataKuliahs') ? ($this->mataKuliahs->pluck('nama')->implode(', ') ?: '-') : '-';

        // Jadwal mengajar — sorted by hari
        $jadwal = [];
        if ($this->relationLoaded('jadwalKuliahs')) {
            $jadwal = $this->jadwalKuliahs
                ->sortBy(fn($j) => $hariOrder[$j->hari] ?? 9)
                ->values()
                ->map(fn($j) => [
                    'hari'       => $j->hari,
                    'jam_mulai'  => $j->jam_mulai,
                    'jam_selesai'=> $j->jam_selesai,
                    'mk'         => $j->mataKuliah?->nama ?? '-',
                    'sks_mk'     => $j->mataKuliah?->sks ?? 0,
                    'ruangan'    => $j->ruangan?->nama_ruangan ?? '-',
                    'kelas'      => $j->kelas?->nama ?? '-',
                    'tipe'       => $j->tipe ?? 'Teori',
                ])->values()->all();
        }

        // Matakuliah diampu
        $mataKuliahs = [];
        if ($this->relationLoaded('mataKuliahs')) {
            $mataKuliahs = $this->mataKuliahs->map(fn($mk) => [
                'kode'   => $mk->kode,
                'nama'   => $mk->nama,
                'sks'    => $mk->sks,
                'sem'    => $mk->sem,
                'jenis'  => $mk->jenis,
                'status' => $mk->status,
            ])->values()->all();
        }

        // Mahasiswa bimbingan
        $mahasiswaBimbingan = [];
        if ($this->relationLoaded('mahasiswaBimbingan')) {
            $mahasiswaBimbingan = $this->mahasiswaBimbingan->map(fn($m) => [
                'nim'     => $m->nim,
                'nama'    => $m->nama,
                'prodi'   => $m->prodi?->nama ?? '-',
                'angkatan'=> $m->angkatan,
                'status'  => $m->status_akademik,
            ])->values()->all();
        }

        return [
            'id'                => $this->id,
            'nidn'              => $this->nidn,
            'nama'              => $this->nama,
            'nama_lengkap'      => $this->nama_lengkap,
            'gelar_depan'       => $this->gelar_depan,
            'gelar_belakang'    => $this->gelar_belakang,
            'prodi'             => $this->prodi?->nama ?? $this->prodi ?? '-',
            'prodi_id'          => $this->prodi_id,
            'status_dosen'      => $this->status_dosen === 'tetap' ? 'Aktif' : 'Cuti',
            'foto_url'          => $this->foto_url,
            'email'             => $this->user?->email ?? '-',
            'hp'                => '-',
            'sks'               => $sks,
            'mhsBimbing'        => $this->relationLoaded('mahasiswaBimbingan') ? $this->mahasiswaBimbingan->count() : 0,
            'rating'            => $this->rating ?? round(4.0 + (rand(0, 10) / 10), 1),
            'pub'               => $this->pub ?? rand(5, 50),
            'initials'          => collect(explode(' ', $this->nama))->map(fn($n) => mb_substr($n, 0, 1))->take(2)->implode(''),
            'ttl'               => '-',
            'pendidikan'        => $this->gelar_depan === 'Dr.' || $this->gelar_depan === 'Prof.' ? 'S3 – Doktor' : 'S2 – Magister',
            'keahlian'          => $keahlian,
            'jabatan'           => $this->jabatan ?? 'Tenaga Pengajar',
            'masaKerja'         => rand(3, 20) . ' tahun',
            'scopus'            => rand(10000, 99999),
            'jadwal'            => $jadwal,
            'mataKuliahs'       => $mataKuliahs,
            'mahasiswaBimbingan' => $mahasiswaBimbingan,
        ];
    }
}
