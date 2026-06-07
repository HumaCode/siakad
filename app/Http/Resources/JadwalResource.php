<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JadwalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Compute Dosen initials from name
        $dosenName = $this->dosen?->nama ?? 'Dosen';
        $words = explode(' ', $dosenName);
        $initials = '';
        foreach ($words as $w) {
            if (!empty($w)) {
                $initials .= strtoupper(substr($w, 0, 1));
            }
        }
        $initials = substr($initials, 0, 2);
        if (strlen($initials) < 2 && strlen($dosenName) >= 2) {
            $initials = strtoupper(substr($dosenName, 0, 2));
        }

        return [
            'id' => $this->id,
            'mata_kuliah_id' => $this->mata_kuliah_id,
            'mata_kuliah' => [
                'id' => $this->mataKuliah?->id,
                'kode' => $this->mataKuliah?->kode,
                'nama' => $this->mataKuliah?->nama,
                'sks' => $this->mataKuliah?->sks,
                'sks_teori' => $this->mataKuliah?->sks_teori,
                'sks_praktik' => $this->mataKuliah?->sks_praktik,
                'sem' => $this->mataKuliah?->sem,
                'jenis' => $this->mataKuliah?->jenis,
            ],
            'ruangan_id' => $this->ruangan_id,
            'ruangan' => [
                'id' => $this->ruangan?->id,
                'nama_gedung' => $this->ruangan?->nama_gedung,
                'nama_ruangan' => $this->ruangan?->nama_ruangan,
                'kapasitas' => $this->ruangan?->kapasitas,
            ],
            'dosen_id' => $this->dosen_id,
            'dosen' => [
                'id' => $this->dosen?->id,
                'nama' => $this->dosen?->nama_lengkap,
                'nidn' => $this->dosen?->nidn,
                'initials' => $initials,
            ],
            'prodi_id' => $this->prodi_id,
            'prodi' => [
                'id' => $this->prodi?->id,
                'nama' => $this->prodi?->nama,
                'kode' => $this->prodi?->kode,
            ],
            'hari' => $this->hari,
            'kelas_id' => $this->kelas_id,
            'kelas' => [
                'id' => $this->kelas_id,
                'nama' => $this->kelas?->nama,
            ],
            'jam_mulai' => substr($this->jam_mulai, 0, 5),
            'jam_selesai' => substr($this->jam_selesai, 0, 5),
            'tipe' => $this->tipe,
        ];
    }
}
