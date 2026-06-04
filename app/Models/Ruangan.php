<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ruangan extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'ruangans';

    protected $fillable = [
        'nama_gedung',
        'nama_ruangan',
        'kapasitas',
    ];
}
