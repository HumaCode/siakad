<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

#[Fillable([
    'user_id',
    'nidn',
    'nama',
    'gelar_depan',
    'gelar_belakang',
    'prodi_id',
    'status_dosen',
    'jabatan',
])]
class Dosen extends Model implements HasMedia
{
    use HasFactory, HasUlids, SoftDeletes, InteractsWithMedia, LogsActivity;

    protected $table = 'dosens';

    protected $appends = ['foto_url'];

    /**
     * Get the photo URL from Spatie media library.
     */
    public function getFotoUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('foto');
        if (!$media) {
            return null;
        }
        return '/storage/' . $media->id . '/' . $media->file_name;
    }

    /**
     * Register media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('foto')
            ->singleFile();
    }

    /**
     * Configure activity logging.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }

    /**
     * Get the formatted full name with degrees.
     */
    public function getNamaLengkapAttribute(): string
    {
        $gelarDepan = $this->gelar_depan ? trim($this->gelar_depan) . ' ' : '';
        $gelarBelakang = $this->gelar_belakang ? ', ' . trim($this->gelar_belakang) : '';
        return $gelarDepan . $this->nama . $gelarBelakang;
    }

    /**
     * Get the user account for this lecturer.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the study program homebase of the lecturer.
     */
    public function prodi(): BelongsTo
    {
        return $this->belongsTo(Prodi::class);
    }

    /**
     * Get the students supervised by this lecturer.
     */
    public function mahasiswaBimbingan(): HasMany
    {
        return $this->hasMany(Mahasiswa::class, 'dosen_wali_id');
    }

    /**
     * Get the courses taught by this lecturer.
     */
    public function mataKuliahs(): HasMany
    {
        return $this->hasMany(MataKuliah::class, 'dosen_id');
    }

    /**
     * Get the teaching schedule for this lecturer.
     */
    public function jadwalKuliahs(): HasMany
    {
        return $this->hasMany(JadwalKuliah::class, 'dosen_id');
    }
}
