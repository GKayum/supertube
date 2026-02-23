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

    // public function user() {
    //     return $this->hasOne(User::class, 'id', 'video_id');
    // }

    public function video() {
        return $this->hasOne(User::class, 'id', 'video_id');
    }
}
