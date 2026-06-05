<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['kode', 'nama', 'dekan'])]
class Fakultas extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'fakultas';

    /**
     * Get the programs of study for this faculty.
     */
    public function prodis(): HasMany
    {
        return $this->hasMany(Prodi::class);
    }
}
