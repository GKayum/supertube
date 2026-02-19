<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'video_id',
        'user_id',
        'text',
    ];

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
