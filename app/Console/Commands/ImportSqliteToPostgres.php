<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ImportSqliteToPostgres extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:import-sqlite {--fresh : Truncate Postgres tables before import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data from SQLite into PostgreSQL maintaining dependencies';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $src = DB::connection('sqlite_import');
        $dst = DB::connection(); // Default Postgres connection

        // List of tables in correct dependency order (Parents -> Children)
        $tables = [
            'roles',
            'users',
            'styles',
            'artists',
            'artist_timelines',
            'rooms',
            'events',
            'tickets',
            'artworks',
            'artwork_rooms',       // Pivot: artwork_id, room_id
            'artwork_user',        // Pivot: artwork_id, user_id
            'comments',
            'likes',
            'saved_artworks',
            'reservations',
            'personal_access_tokens',
            'oauth_clients',
            'oauth_personal_access_clients',
            'oauth_access_tokens',
            'oauth_refresh_tokens',
            'oauth_auth_codes',
        ];

        // Tables to skip (internal or no data needed)
        // 'migrations', 'sqlite_sequence', 'jobs', 'failed_jobs', 'cache', etc.

        $this->info('Starting import SQLite -> PostgreSQL...');

        // 1. FRESH: Truncate tables in reverse order to respect FKs
        if ($this->option('fresh')) {
            $this->warn('Truncating destination tables...');
            
            // Disable Foreign Key checks for the session to allow truncation
            $dst->statement("SET session_replication_role = 'replica';"); 

            foreach (array_reverse($tables) as $table) {
                if (Schema::connection($dst->getName())->hasTable($table)) {
                    $dst->table($table)->truncate();
                    $this->line("- Truncated {$table}");
                }
            }

            $dst->statement("SET session_replication_role = 'origin';");
        }

        // 2. IMPORT
        $dst->statement("SET session_replication_role = 'replica';"); // Disable FK checks during import

        foreach ($tables as $table) {
            if (!Schema::connection('sqlite_import')->hasTable($table)) {
                $this->warn("Skipping {$table}: Not found in SQLite source.");
                continue;
            }
            if (!Schema::connection($dst->getName())->hasTable($table)) {
                $this->error("Skipping {$table}: Not found in PostgreSQL destination. Run migrations first.");
                continue;
            }

            // Fetch all rows
            $rows = $src->table($table)->get();
            $count = $rows->count();

            if ($count === 0) {
                $this->line("Skipping {$table}: No data.");
                continue;
            }

            $this->info("Importing {$table} ({$count} rows)...");

            // Chunk insert to manage memory
            $chunks = $rows->chunk(500);

            foreach ($chunks as $chunk) {
                // Convert objects to arrays
                $data = $chunk->map(fn($row) => (array) $row)->toArray();
                $dst->table($table)->insert($data);
            }

            // 3. RESET SEQUENCE (Postgres specific)
            // Essential to prevent "duplicate key value violates unique constraint" errors
            if (Schema::connection($dst->getName())->hasColumn($table, 'id')) {
                $this->resetPostgresSequence($dst, $table);
            }
        }

        $dst->statement("SET session_replication_role = 'origin';"); // Re-enable FK checks

        $this->info('✅ Import completed successfully.');
        return Command::SUCCESS;
    }

    /**
     * Reset PostgreSQL sequence for a table to the max(id)
     */
    private function resetPostgresSequence($connection, $table)
    {
        try {
            // Get the maximum ID currently in the table
            $maxId = $connection->table($table)->max('id');
            
            if ($maxId) {
                // Use pg_get_serial_sequence to invoke the correct sequence automatically
                // setval(sequence_name, next_value, is_called)
                // We set it to maxId, so next nextval() will return maxId + 1
                $connection->statement("SELECT setval(pg_get_serial_sequence('{$table}', 'id'), {$maxId})");
            }
        } catch (\Exception $e) {
            // Sequence might not exist (e.g. UUIDs or non-serial IDs), ignore safely
            // $this->warn("Note: Could not reset sequence for {$table} (might use UUID or non-standard sequence)");
        }
    }
}
