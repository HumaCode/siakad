<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProdiRequest extends FormRequest
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
        $prodiId = $this->route('prodi');
        if ($prodiId instanceof \App\Models\Prodi) {
            $prodiId = $prodiId->id;
        }

        return [
            'fakultas_id' => ['required', 'string', 'exists:fakultas,id'],
            'kode' => [
                'required',
                'string',
                'max:50',
                Rule::unique('prodis', 'kode')->ignore($prodiId),
            ],
            'nama' => ['required', 'string', 'max:255'],
            'jenjang' => ['required', 'string', 'in:D3,S1,S2,S3'],
            'kaprodi' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:Aktif,Revisi,Tidak Aktif'],
            'deskripsi' => ['nullable', 'string'],
            'sks' => ['required', 'integer', 'min:1'],
            'lama_studi' => ['required', 'integer', 'min:1'],
            'akreditasi' => ['required', 'string', 'max:50'],
            'tahun' => ['required', 'integer', 'min:1900', 'max:2100'],
        ];
    }
}
