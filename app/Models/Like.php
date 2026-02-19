<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $fillable = [
        'user_id',
        'video_id',
        'result',
    ];

    public function user() {
        return $this->hasOne(User::class, 'id', 'video_id');
    }
}
