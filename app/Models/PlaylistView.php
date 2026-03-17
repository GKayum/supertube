<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaylistView extends Model
{
    protected $fillable = [
        'playlist_id',
        'user_id',
        'ip',
        'user_agent',
        'fingerprint',
    ];

    public function playlist() {
        return $this->hasOne(Playlist::class, 'id', 'playlist_id');
    }
}
