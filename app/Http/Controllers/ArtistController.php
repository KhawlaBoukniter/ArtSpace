<?php

namespace App\Http\Controllers;

use App\Http\Requests\Artist\UpdateArtistProfileRequest;
use App\Models\Artist;
use App\Services\ArtistService;
use Illuminate\Support\Facades\Auth;

class ArtistController extends Controller
{
    protected $artistService;

    public function __construct(ArtistService $artistService)
    {
        $this->artistService = $artistService;
    }

    public function updateProfile(UpdateArtistProfileRequest $request)
    {
        try {
            $data = $this->artistService->updateProfile(
                $request->only(['name', 'email']),
                $request->only(['bio', 'website', 'instagram', 'twitter']),
                $request->file('avatar')
            );

            return response()->json([
                'message' => 'Profil mis à jour avec succès.',
                'user' => $data['user'],
                'artist' => $data['artist']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 404);
        }
    }

    public function getPendingArtists()
    {
        return response()->json($this->artistService->getPendingArtists());
    }

    public function validateArtist($id)
    {
        $artist = Artist::findOrFail($id);
        $this->artistService->validateArtist($id);

        return response()->json(['message' => 'Artist validated successfully']);
    }

    public function showPortfolio($id)
    {
        $artist = Artist::with([
            'user',
            'timelines' => function ($query) {
                $query->orderBy('year', 'desc');
            },
            'artworks',
            'events'
        ])->find($id);

        if (!$artist) {
            return response()->json(['message' => 'Artiste introuvable'], 404);
        }

        return response()->json([
            'artist' => [
                'avatar' => $artist->avatar ? asset('storage/' . $artist->avatar) : null,
                'bio' => $artist->bio,
            ],
            'user' => [
                'name' => $artist->user->name,
                'email' => $artist->user->email,
            ],
            'timelines' => $artist->timelines,
            'artworks' => $artist->artworks,
            'events' => $artist->events
        ]);
    }
}
