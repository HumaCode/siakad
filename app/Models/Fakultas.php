<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

#[Fillable(['kode', 'nama', 'dekan'])]
class Fakultas extends Model
{
    use HasFactory, HasUlids, LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->useLogName('Fakultas')
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    protected $table = 'fakultas';

    /**
     * Get the programs of study for this faculty.
     */
    public function prodis(): HasMany
    {
        return $this->hasMany(Prodi::class);
    }
}
