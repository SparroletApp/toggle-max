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
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->text('category_desc')->nullable();
            $table->string('portfolio_badge')->nullable();
            $table->string('project_owner')->nullable();
            $table->string('title');
            $table->longText('desc')->nullable();
            $table->string('image')->nullable();
            $table->json('details')->nullable();
            $table->json('objectives')->nullable();
            $table->json('concepts')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};