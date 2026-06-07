<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

#[Fillable([
    'prodi_id',
    'kode',
    'nama',
    'sks',
    'sem',
    'jenis',
    'prasyarat',
    'dosen_id',
    'status',
    'deskripsi',
])]
class MataKuliah extends Model
{
    use HasFactory, HasUlids, SoftDeletes, LogsActivity;

    protected $table = 'mata_kuliahs';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->useLogName('MataKuliah')
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Get the program of study that owns this course.
     */
    public function prodi(): BelongsTo
    {
        return $this->belongsTo(Prodi::class);
    }

    /**
     * Get the lecturer that teaches this course.
     */
    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }
}
