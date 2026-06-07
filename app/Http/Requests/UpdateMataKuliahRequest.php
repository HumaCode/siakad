<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMataKuliahRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $matakuliahId = $this->route('matakuliah')?->id;

        return [
            'kode' => [
                'required',
                'string',
                'max:50',
                Rule::unique('mata_kuliahs', 'kode')->ignore($matakuliahId)->where('prodi_id', $this->prodi_id),
            ],
            'nama' => ['required', 'string', 'max:255'],
            'prodi_id' => ['required', 'string', 'exists:prodis,id'],
            'sks_teori' => ['required', 'integer', 'min:0'],
            'sks_praktik' => ['required', 'integer', 'min:0'],
            'sem' => ['required', 'integer', 'min:1', 'max:8'],
            'jenis' => ['required', 'string', 'in:Wajib,Pilihan,Praktikum'],
            'prasyarat' => ['nullable', 'string', 'max:255'],
            'dosen_id' => ['required', 'string', 'exists:dosens,id'],
            'deskripsi' => ['required', 'string'],
            'status' => ['required', 'string', 'in:Aktif,Nonaktif'],
        ];
    }
}
