<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJadwalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mata_kuliah_id' => ['required', 'string', 'exists:mata_kuliahs,id'],
            'hari' => ['required', 'string', 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu'],
            'kelas_id' => ['required', 'string', 'exists:kelas,id'],
            'jam_mulai' => ['required', 'string', 'regex:/^\d{2}:\d{2}$/'],
            'jam_selesai' => ['required', 'string', 'regex:/^\d{2}:\d{2}$/'],
            'ruangan_id' => ['required', 'string', 'exists:ruangans,id'],
            'tipe' => ['required', 'string', 'in:Teori,Praktikum,Studio'],
        ];
    }
}
