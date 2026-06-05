<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Spatie\Permission\Models\Role as SpatieRole;

#[Fillable([
    'name',
    'slug',
    'type_role',
    'color',
    'priority',
    'is_active',
    'description',
    'guard_name',
])]
class Role extends SpatieRole
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'priority' => 'integer',
        ];
    }
}
