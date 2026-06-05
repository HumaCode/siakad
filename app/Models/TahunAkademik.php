<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable([
    'tahun',
    'semester',
    'status',
])]
class TahunAkademik extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'tahun_akademiks';

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }
}
