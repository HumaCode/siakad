<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDosenRequest extends FormRequest
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
        $dosenId = $this->route('id') ?? $this->route('dosen');
        if ($dosenId instanceof \App\Models\Dosen) {
            $dosenId = $dosenId->id;
        }

        $dosen = \App\Models\Dosen::find($dosenId);
        $userId = $dosen ? $dosen->user_id : null;

        return [
            'nidn' => ['required', 'string', 'size:10', Rule::unique('dosens', 'nidn')->ignore($dosenId)],
            'nama' => ['required', 'string', 'max:255'],
            'gelar_depan' => ['nullable', 'string', 'max:20'],
            'gelar_belakang' => ['nullable', 'string', 'max:50'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'prodi' => ['required', 'string'],
            'jabatan' => ['required', 'string'],
            'status' => ['required', 'string'],
            'foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ];
    }
}
