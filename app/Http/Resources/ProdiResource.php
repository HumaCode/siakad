<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProdiResource extends JsonResource
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
            'fakultas_id' => $this->fakultas_id,
            'kode' => $this->kode,
            'nama' => $this->nama,
            'jenjang' => $this->jenjang,
            'kaprodi' => $this->kaprodi,
            'status' => $this->status,
            'fakultas' => $this->relationLoaded('fakultas') && $this->fakultas ? [
                'id' => $this->fakultas->id,
                'nama' => $this->fakultas->nama,
                'kode' => $this->fakultas->kode,
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
