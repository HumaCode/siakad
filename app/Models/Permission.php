<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Spatie\Permission\Models\Permission as SpatiePermission;

#[Fillable(['name', 'guard_name', 'is_active'])]
class Permission extends SpatiePermission
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function menus(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Konfigurasi\Menu::class, 'menu_permission');
    }
}
