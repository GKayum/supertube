<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $fillable = [
        'video_id',
        'user_id',
        'fingerprint',
        'result',
    ];

    public function video() {
        return $this->hasOne(Video::class, 'id', 'video_id');
    }
}
