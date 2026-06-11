<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFakultasRequest extends FormRequest
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
        // Get the faculty model instance or ID from route binding
        $fakultas = $this->route('fakultas');
        $id = is_object($fakultas) ? $fakultas->id : $fakultas;

        return [
            'kode' => ['required', 'string', 'max:50', Rule::unique('fakultas', 'kode')->ignore($id)],
            'nama' => ['required', 'string', 'max:255'],
            'dekan' => ['nullable', 'string', 'max:255'],
        ];
    }
}
