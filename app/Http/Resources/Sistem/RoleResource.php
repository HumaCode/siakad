<?php

namespace App\Http\Resources\Sistem;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'color' => $this->color,
            'priority' => (int) $this->priority,
            'is_active' => (bool) $this->is_active,
            'type_role' => $this->type_role,
            'guard_name' => $this->guard_name,
            'users_count' => (int) $this->users_count,
            'permissions' => PermissionResource::collection($this->whenLoaded('permissions')),
        ];
    }
}
