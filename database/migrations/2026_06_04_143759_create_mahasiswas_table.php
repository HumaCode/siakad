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
        Schema::create('mahasiswas', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('nim')->unique();
            $table->string('nama');
            $table->foreignUlid('prodi_id')->constrained('prodis')->cascadeOnDelete();
            $table->year('angkatan');
            $table->enum('status_akademik', ['aktif', 'cuti', 'lulus', 'do'])->default('aktif');
            $table->foreignUlid('dosen_wali_id')->nullable()->constrained('dosens')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswas');
    }
};
