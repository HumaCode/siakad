<?php

namespace App\Models\Konfigurasi;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Permission;

#[Fillable([
    'name',
    'url',
    'category',
    'icon',
    'active',
    'orders',
    'main_menu_id',
])]
class Menu extends Model
{
    protected $table = 'menus';

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'orders' => 'integer',
        ];
    }

    public function mainMenu(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'main_menu_id');
    }

    public function subMenus(): HasMany
    {
        return $this->hasMany(Menu::class, 'main_menu_id')->orderBy('orders');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'menu_permission');
    }
}
