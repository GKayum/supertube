<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'image',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comments() {
        return $this->hasMany(EntryComment::class)->latest();
    }

    public function likes() {
        return $this->hasMany(EntryLike::class);
    }

    public function likesCount() {
        return $this->hasMany(EntryLike::class)->where('result', 1)->count();
    }
    public function dislikesCount() {
        return $this->hasMany(EntryLike::class)->where('result', 0)->count();
    }
}
