<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFakultasRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'kode' => ['required', 'string', 'max:50', 'unique:fakultas,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'dekan' => ['nullable', 'string', 'max:255'],
        ];
    }
}
