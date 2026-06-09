<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMahasiswaRequest extends FormRequest
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
            'nim' => ['required', 'string', 'unique:mahasiswas,nim'],
            'nama' => ['required', 'string', 'max:255'],
            'prodi_id' => ['required', 'exists:prodis,id'],
            'angkatan' => ['required', 'string', 'max:4'],
            'status_akademik' => ['required', 'string', 'in:Aktif,Cuti,Lulus,Drop Out,Non-Aktif'],
            'dosen_wali_id' => ['nullable', 'exists:dosens,id'],
            'kelas' => ['nullable', 'string', 'max:255'],
            'email_akademik' => ['required', 'email', 'unique:users,email'],
            'password_awal' => ['nullable', 'string', 'min:8'],
            'foto' => ['nullable', 'image', 'max:2048'],
            'ktp' => ['nullable', 'file', 'mimes:pdf,jpeg,png,jpg', 'max:2048'],
            'kk' => ['nullable', 'file', 'mimes:pdf,jpeg,png,jpg', 'max:2048'],
        ];
    }
}
