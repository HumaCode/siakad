<?php

namespace App\Http\Resources\Sistem;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'name' => $this->name,
            'url' => $this->url,
            'category' => $this->category,
            'icon' => $this->icon,
            'active' => (bool) $this->active,
            'orders' => (int) $this->orders,
            'main_menu_id' => $this->main_menu_id ? (int) $this->main_menu_id : null,
            'main_menu_name' => $this->relationLoaded('mainMenu') && $this->mainMenu ? $this->mainMenu->name : null,
            'sub_menus_count' => (int) ($this->sub_menus_count ?? 0),
            'permissions' => $this->relationLoaded('permissions') ? $this->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                ];
            }) : [],
        ];
    }
}
