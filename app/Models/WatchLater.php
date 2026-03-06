<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WatchLater extends Model
{
    protected $fillable = [
        'user_id',
        'video_id',
    ];

    public function video() {
        return $this->hasOne(Video::class, 'id', 'video_id');
    }

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
