<?php

namespace App\Http\Requests\Sistem;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PermissionUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $permissionId = $this->route('permission');
        $id = is_object($permissionId) ? $permissionId->id : $permissionId;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permissions', 'name')->ignore($id)->where(function ($query) {
                    return $query->where('guard_name', $this->input('guard_name', 'web'));
                }),
            ],
            'is_active' => ['required', 'boolean'],
            'guard_name' => ['required', 'string', 'in:web,api'],
        ];
    }
}
