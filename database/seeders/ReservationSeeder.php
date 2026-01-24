<?php

namespace Database\Seeders;

use App\Models\Artist;
use App\Models\Artwork;
use App\Models\Event;
use App\Models\Reservation;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing visitor user (role_id=3)
        $visitor = User::where('role_id', 3)->first();
        if (!$visitor) {
            $this->command->warn("Aucun utilisateur avec role_id=3 (visiteur) trouvé.");
            return;
        }

        // Get existing artist user (role_id=2) instead of creating new one
        $artistUser = User::where('role_id', 2)->first();
        if (!$artistUser) {
            $this->command->warn("Aucun utilisateur avec role_id=2 (artiste) trouvé.");
            return;
        }

        // Get or create artist profile for this user
        $artist = Artist::firstOrCreate(['user_id' => $artistUser->id]);

        // Create demo artwork and event for reservation
        $artwork = Artwork::factory()->create([
            'artist_id' => $artist->id,
            'title' => 'Digital Mirage',
        ]);

        $event = Event::factory()->create([
            'artist_id' => $artist->id,
            'title' => 'Art Expo 2025',
        ]);

        $ticket = Ticket::factory()->create([
            'event_id' => $event->id,
            'price' => 250,
            'type' => 'standard',
        ]);

        Reservation::create([
            'user_id' => $visitor->id,
            'ticket_id' => $ticket->id,
            'status' => 'paid',
        ]);
    }
}
