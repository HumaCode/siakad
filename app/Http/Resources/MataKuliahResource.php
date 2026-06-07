<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MataKuliahResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'prodi_id' => $this->prodi_id,
            'kode' => $this->kode,
            'nama' => $this->nama,
            'sks' => $this->sks,
            'sem' => $this->sem,
            'jenis' => $this->jenis,
            'prasyarat' => $this->prasyarat,
            'dosen_id' => $this->dosen_id,
            'dosen_nama' => $this->relationLoaded('dosen') && $this->dosen ? $this->dosen->nama_lengkap : null,
            'dosen' => $this->relationLoaded('dosen') && $this->dosen ? [
                'id' => $this->dosen->id,
                'nama' => $this->dosen->nama_lengkap,
                'nidn' => $this->dosen->nidn,
            ] : null,
            'status' => $this->status,
            'deskripsi' => $this->deskripsi,
            'prodi' => $this->relationLoaded('prodi') && $this->prodi ? [
                'id' => $this->prodi->id,
                'nama' => $this->prodi->nama,
                'kode' => $this->prodi->kode,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
