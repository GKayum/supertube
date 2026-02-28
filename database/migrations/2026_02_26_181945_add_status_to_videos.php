<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->enum('status', [
                'draft',
                'published',
                'scheduled',
                'proccessing',
                'blocked',
                'private',
                'hidden',
                'archived',
                'deleted',
            ])
            ->default('draft')
            ->after('description')
            ->index();

            $table->string('hidden_hash', 16)
                ->nullable()
                ->unique()
                ->after('status');
        });

        DB::table('videos')->update(['status' => 'published']);

        $videos = DB::table('videos')->get();

        foreach ($videos as $video) {
            DB::table('videos')->where('id', $video->id)
                ->update(['hidden_hash' => Str::random(16)]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropUnique(['hidden_hash']);
            $table->dropColumn(['status' => 'hidden_hash']);
        });
    }
};
