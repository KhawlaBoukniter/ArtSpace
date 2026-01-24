<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all existing artists to have is_validated = true
        DB::table('artists')->update(['is_validated' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert validation status (optional, but good practice)
        // Warning: this reverts ALL to false, which might lose data state if some were true before.
        // For this specific feature (auto-validate all), we can assume reverting means going back to unvalidated state or doing nothing.
        // DB::table('artists')->update(['is_validated' => false]);
    }
};
