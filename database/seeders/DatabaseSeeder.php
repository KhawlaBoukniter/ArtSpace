<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Order matters: respect foreign key dependencies
        $this->call([
            // 1. Base tables first
            RoleSeeder::class,
            UserSeeder::class,
            
            // 2. Artists and Styles (independent)
            ArtistSeeder::class,
            StyleSeeder::class,
            
            // 3. Artworks (depends on artists and styles)
            ArtworkSeeder::class,
            ArtworkPriceSeeder::class,
            
            // 4. Events (depends on artists)
            EventSeeder::class,
            
            // 5. Tickets (depends on events)
            TicketSeeder::class,
            
            // 6. Reservations (depends on events, tickets, users)
            ReservationSeeder::class,
            
            // 7. Relationships and interactions (depend on artworks/users)
            CommentSeeder::class,
            ArtworkUserSeeder::class,
            SavedArtworksSeeder::class,
        ]);
    }
}
