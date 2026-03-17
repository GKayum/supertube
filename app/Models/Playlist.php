<?php

namespace App\Models;

use App\Enums\VideoStatus;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
    ];

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function videos() {
        return $this->belongsToMany(Video::class, 'playlist_videos')
            ->using(PlaylistVideo::class)
            ->withPivot(['position', 'added_at'])
            ->orderBy('position');
    }

    public function views() {
        return $this->hasMany(PlaylistView::class);
    }

    public function publishedVideos() {
        return $this->videos()->where('videos.status', VideoStatus::Published->value);
    }
}
