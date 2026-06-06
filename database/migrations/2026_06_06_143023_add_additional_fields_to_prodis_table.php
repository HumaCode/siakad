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
        Schema::table('prodis', function (Blueprint $table) {
            $table->text('deskripsi')->nullable()->after('status');
            $table->integer('sks')->default(144)->after('deskripsi');
            $table->integer('lama_studi')->default(8)->after('sks');
            $table->string('akreditasi')->default('Unggul')->after('lama_studi');
            $table->integer('tahun')->default(2024)->after('akreditasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prodis', function (Blueprint $table) {
            $table->dropColumn(['deskripsi', 'sks', 'lama_studi', 'akreditasi', 'tahun']);
        });
    }
};
