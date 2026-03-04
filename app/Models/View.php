<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class View extends Model
{
    protected $fillable = [
        'user_id',
        'video_id',
        'ip',
        'user_agent',
    ];

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function video() {
        return $this->hasOne(Video::class, 'id', 'video_id');
    }
}
