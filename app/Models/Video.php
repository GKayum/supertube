<?php

namespace App\Models;

use App\Enums\VideoStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'hidden_hash',
        'path',
        'scheduled_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function scopeDueToPublish(Builder $q): Builder
    {
        return $q->where('status', VideoStatus::Scheduled)
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', Carbon::now());
    }

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
