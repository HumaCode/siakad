<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProdiRequest extends FormRequest
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
        return [
            'fakultas_id' => ['required', 'string', 'exists:fakultas,id'],
            'kode' => ['required', 'string', 'max:50', 'unique:prodis,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'jenjang' => ['required', 'string', 'in:D3,S1,S2,S3'],
            'kaprodi' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:Aktif,Revisi,Tidak Aktif'],
        ];
    }
}
