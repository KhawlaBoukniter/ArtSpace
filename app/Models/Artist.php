<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artist extends User
{
    protected $fillable = [
        'user_id',
        'bio',
        'avatar',
        'website',
        'instagram',
        'twitter',
        'is_validated',
        'timeline'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artworks()
    {
        return $this->hasMany(Artwork::class);
    }

    public function getRouteKeyName()
    {
        return 'user_id';
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function timelines()
    {
        return $this->hasMany(ArtistTimeline::class);
    }
}
