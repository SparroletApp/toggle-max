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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();

            $table->string('badge_title')->nullable();
            $table->string('title');
            $table->longText('desc')->nullable();
            $table->string('main_image')->nullable();
            $table->json('images')->nullable();
            $table->json('questions_answers')->nullable();

            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};