<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    protected $fillable = [
        'user_id',
        'avatar',
        'title',
        'description',
    ];

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
