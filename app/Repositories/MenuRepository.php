<?php

namespace App\Repositories;

use App\Models\Konfigurasi\Menu;
use Illuminate\Support\Collection;

class MenuRepository
{
    /**
     * Get all active parent menus with their submenus.
     *
     * @return Collection
     */
    public function getMenus(): Collection
    {
        return Menu::with(['subMenus' => function ($query) {
                $query->where('active', true)->orderBy('orders');
            }])
            ->whereNull('main_menu_id')
            ->where('active', true)
            ->orderBy('orders')
            ->get();
    }
}
