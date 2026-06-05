<?php

namespace App\Http\Resources\Sistem;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->relationLoaded('roles')
                ? RoleResource::collection($this->roles)->resolve()
                : [],
            'mahasiswa' => $this->mahasiswa ? [
                'nim' => $this->mahasiswa->nim,
                'status_akademik' => $this->mahasiswa->status_akademik,
            ] : null,
            'dosen' => $this->dosen ? [
                'nidn' => $this->dosen->nidn,
                'status_dosen' => $this->dosen->status_dosen,
            ] : null,
        ];
    }
}
