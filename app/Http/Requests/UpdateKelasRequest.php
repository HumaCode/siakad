<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prodi_id' => ['required', 'string', 'exists:prodis,id'],
            'nama' => ['required', 'string', 'max:100'],
            'status' => ['required', 'string', 'in:Aktif,Nonaktif'],
        ];
    }
}
