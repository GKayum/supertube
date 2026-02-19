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
}
