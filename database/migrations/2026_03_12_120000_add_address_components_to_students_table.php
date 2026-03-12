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
        Schema::table('students', function (Blueprint $table) {
            // break the existing "address" column into components
            if (Schema::hasColumn('students', 'address')) {
                // keep the old address column for now (nullable) so existing data isn't lost
                // You may remove it manually later after migrating values if needed.
            }

            $table->string('street')->nullable()->after('gender');
            $table->string('barangay')->nullable()->after('street');
            $table->string('municipality')->nullable()->after('barangay');
            $table->string('province')->nullable()->after('municipality');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['street', 'barangay', 'municipality', 'province']);
            // do not recreate address column here since it already exists
        });
    }
};