<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up(): void {
    Schema::create('document_requests', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');

        // Use this instead of $table->string('document_type')
        $table->foreignId('document_type_id')->constrained()->onDelete('cascade');

        $table->text('purpose');
        $table->integer('copies')->default(1);
        $table->string('attachment')->nullable();
        $table->string('status')->default('Pending');
        $table->text('admin_notes')->nullable();
        $table->string('final_file')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
