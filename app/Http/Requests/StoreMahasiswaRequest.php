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
            'nik' => ['nullable', 'string', 'max:255'],
            'no_kk' => ['nullable', 'string', 'max:255'],
            'tempat_lahir' => ['nullable', 'string', 'max:255'],
            'tanggal_lahir' => ['nullable', 'date'],
            'jenis_kelamin' => ['nullable', 'string', 'max:255'],
            'agama' => ['nullable', 'string', 'max:255'],
            'kewarganegaraan' => ['nullable', 'string', 'max:255'],
            'no_hp' => ['nullable', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'semester_saat_ini' => ['nullable', 'integer'],
            'fakultas' => ['nullable', 'string', 'max:255'],
            'jalur_masuk' => ['nullable', 'string', 'max:255'],
            'asal_sekolah' => ['nullable', 'string', 'max:255'],
            'tahun_lulus_sma' => ['nullable', 'integer'],
            'status_awal' => ['nullable', 'string', 'max:255'],
            'ayah_nama' => ['nullable', 'string', 'max:255'],
            'ayah_pekerjaan' => ['nullable', 'string', 'max:255'],
            'ayah_penghasilan' => ['nullable', 'string', 'max:255'],
            'ibu_nama' => ['nullable', 'string', 'max:255'],
            'ibu_pekerjaan' => ['nullable', 'string', 'max:255'],
            'ibu_no_hp' => ['nullable', 'string', 'max:255'],
            'ortu_alamat' => ['nullable', 'string'],
            'email_pribadi' => ['nullable', 'string', 'max:255'],
        ];
    }
}
