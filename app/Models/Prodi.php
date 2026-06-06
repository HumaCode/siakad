<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

#[Fillable([
    'fakultas_id',
    'kode',
    'nama',
    'jenjang',
    'kaprodi',
    'status',
    'deskripsi',
    'sks',
    'lama_studi',
    'akreditasi',
    'tahun',
])]
class Prodi extends Model
{
    use HasFactory, HasUlids, SoftDeletes, LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->useLogName('Prodi')
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    protected $table = 'prodis';

    /**
     * Get the faculty that owns this program of study.
     */
    public function fakultas(): BelongsTo
    {
        return $this->belongsTo(Fakultas::class);
    }

    /**
     * Get the lecturers associated with this study program.
     */
    public function dosens(): HasMany
    {
        return $this->hasMany(Dosen::class);
    }

    /**
     * Get the students enrolled in this study program.
     */
    public function mahasiswas(): HasMany
    {
        return $this->hasMany(Mahasiswa::class);
    }
}
