<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoverChannel extends Model
{
    protected $fillable = [
        'channel_id',
        'width',
        'height',
        'path',
    ];
}
