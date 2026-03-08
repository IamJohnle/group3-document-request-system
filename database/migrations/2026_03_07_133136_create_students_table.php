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
    Schema::create('students', function (Blueprint $table) {
        $table->id();

        // Link to User account
        $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');

        // Personal Info
        $table->string('first_name');
        $table->string('last_name');
        $table->string('middle_name')->nullable();
        $table->string('email')->unique();
        $table->string('contact_number')->nullable();
        $table->date('birth_date')->nullable();
        $table->string('gender')->nullable();
        $table->string('address')->nullable();

        // Academic Info
        $table->string('student_id')->unique();
        $table->string('course')->nullable();
        $table->string('year_level')->nullable();
        $table->string('section')->nullable();
        $table->date('enrollment_date')->nullable();
        $table->boolean('is_active')->default(true);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
