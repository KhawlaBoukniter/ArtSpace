<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function artist()
    {
        return $this->hasOne(Artist::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function savedArtworks()
    {
        return $this->belongsToMany(Artwork::class, 'saved_artworks')->withTimestamps();
    }

    public function likedArtworks()
    {
        return $this->belongsToMany(Artwork::class, 'likes')->withTimestamps();
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function purchasedArtworks()
    {
        return $this->belongsToMany(Artwork::class, 'artwork_user')
            ->withPivot('price', 'purchased_at')
            ->withTimestamps();
    }
}
