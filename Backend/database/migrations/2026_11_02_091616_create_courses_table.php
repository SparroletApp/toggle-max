
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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('key_points')->nullable();
            $table->unsignedInteger('months')->nullable();
            $table->unsignedInteger('days')->nullable();
            $table->string('image')->nullable();
            $table->string('badge')->nullable();
            $table->string('curriculum_title')->nullable();
            $table->text('curriculum_description')->nullable();
            $table->json('curriculum_points')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
