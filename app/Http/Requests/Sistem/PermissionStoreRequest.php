<?php

namespace App\Http\Requests\Sistem;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PermissionStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permissions', 'name')->where(function ($query) {
                    return $query->where('guard_name', $this->input('guard_name', 'web'));
                }),
            ],
            'is_active' => ['required', 'boolean'],
            'guard_name' => ['required', 'string', 'in:web,api'],
        ];
    }
}
