<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PlaylistVideo extends Pivot
{
    protected $fillable = [
        'position',
        'added_at',
    ];
}
