<?php

namespace App\Services;

use App\Models\Artist;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    protected $userRepo;

    public function __construct(UserRepository $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function register(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        $data['email_verified_at'] = now(); // Auto-verify all new accounts
        $user = $this->userRepo->create($data);

        if ($user->role_id == 2) {
            Artist::create([
                'user_id' => $user->id,
                'is_validated' => true
            ]);
        }

        $token = $user->createToken('auth_token')->accessToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function login(array $credentials)
    {
        if (!Auth::attempt($credentials)) {
            return null;
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check if user is an artist and if their account is validated
        // Use eager loading or safe access to relations
        if ($user->role_id == 2) {
             // Reload to ensure artist relation is loaded if needed, though usually lazy loaded
             // Check if artist record exists first to avoid crash
             if ($user->artist && $user->artist->is_validated === false) { // Ensure boolean comparison
                Auth::logout();
                return 'Non validé';
             }
        }

        $token = $user->createToken('auth_token')->accessToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function me()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return $user->load('artist');
    }

    public function logout()
    {
        $user = Auth::user();
        $user->tokens()->delete();

        return true;
    }

    public function uploadAvatar(User $user, $avatarFile)
    {
        $path = $avatarFile->store('avatars', 'public');
        $user->avatar = $path;
        $user->save();

        return asset('storage/' . $path);
    }
}
