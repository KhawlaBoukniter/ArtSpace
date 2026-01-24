<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get role IDs by name for robustness
        $visitorRoleId = \App\Models\Role::where('name', 'visitor')->first()?->id;
        $artistRoleId = \App\Models\Role::where('name', 'artist')->first()?->id;
        $adminRoleId = \App\Models\Role::where('name', 'admin')->first()?->id;

        if (!$visitorRoleId || !$artistRoleId || !$adminRoleId) {
            $this->command->error('Roles not found. Run RoleSeeder first.');
            return;
        }

        // Create 3 visitor users
        User::factory()->count(3)->create([
            'role_id' => $visitorRoleId,
        ]);

        // Create 3 artist users
        User::factory()->count(3)->create([
            'role_id' => $artistRoleId,
        ]);

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role_id' => $adminRoleId,
        ]);
    }
}
