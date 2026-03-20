<?php

namespace App\Helpers;

use getID3;
use Illuminate\Support\Facades\Storage;

class VideoAnalyzer
{
    public static function getDurationSeconds(string $path): ?int
    {
        $getID3 = new getID3;
        $info = $getID3->analyze(Storage::disk('public')->path($path));

        if (!empty($info['playtime_seconds'])) {
            return (int) round($info['playtime_seconds']);
        }

        return null;
    }
}