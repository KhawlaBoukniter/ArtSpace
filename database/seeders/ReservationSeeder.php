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
        // Get role IDs by name for robustness
        $visitorRoleId = \App\Models\Role::where('name', 'visitor')->first()?->id;
        $artistRoleId = \App\Models\Role::where('name', 'artist')->first()?->id;

        if (!$visitorRoleId || !$artistRoleId) {
            $this->command->error('Required roles not found.');
            return;
        }

        // Get existing visitor user
        $visitor = User::where('role_id', $visitorRoleId)->first();
        if (!$visitor) {
            $this->command->warn("No visitor user found.");
            return;
        }

        // Get existing artist user
        $artistUser = User::where('role_id', $artistRoleId)->first();
        if (!$artistUser) {
            $this->command->warn("No artist user found.");
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
