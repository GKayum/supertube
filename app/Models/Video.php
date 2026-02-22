<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'path',
    ];

    public function covers() {
        return $this->hasMany(Cover::class);
    }

    public function views() {
        return $this->hasMany(View::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
