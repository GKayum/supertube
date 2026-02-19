<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cover extends Model
{
    protected $fillable = [
        'video_id',
        'width',
        'height',
        'path',
    ];
}
