<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_create_expenses_table.php
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->decimal('amount', 10, 2);
            $table->string('type')->nullable();  // for future-proofing (text, image, etc)
            $table->date('date');
            $table->timestamps();
        });
    }

     
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
