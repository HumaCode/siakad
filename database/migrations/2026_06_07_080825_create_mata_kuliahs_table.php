<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mata_kuliahs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('prodi_id')->constrained('prodis')->cascadeOnDelete();
            $table->string('kode')->unique();
            $table->string('nama');
            $table->integer('sks');
            $table->integer('sem');
            $table->enum('jenis', ['Wajib', 'Pilihan', 'Praktikum'])->default('Wajib');
            $table->string('prasyarat')->nullable();
            $table->foreignUlid('dosen_id')->nullable()->constrained('dosens')->nullOnDelete();
            $table->enum('status', ['Aktif', 'Nonaktif'])->default('Aktif');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mata_kuliahs');
    }
};
