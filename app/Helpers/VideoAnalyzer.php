<?php

namespace App\Helpers;

use App\Resolvers\VideoDimensions;
use getID3;
use Illuminate\Support\Facades\Storage;

class VideoAnalyzer
{
    public function __construct(
        private readonly VideoDimensions $videoDimensions,
    ) {
    }

    public static function getDurationSeconds(string $path): ?int
    {
        $getID3 = new getID3;
        $info = $getID3->analyze(Storage::disk('public')->path($path));

        if (!empty($info['playtime_seconds'])) {
            return (int) round($info['playtime_seconds']);
        }

        return null;
    }

    public function isShort(string $path): bool
    {
        $dimensions = $this->videoDimensions->resolve(Storage::disk('public')->path($path));

        $width = $dimensions['width'];
        $height = $dimensions['height'];
        $rotation = $dimensions['rotation'];

        $aspectThreshold = 1.4;

        if (!$width || !$height) {
            return false;
        }

        $rot = ((int)($rotation ?? 0)) % 360;
        $swap = in_array(abs($rot), [90, 270], true);

        $effectiveWidth = $swap ? $height : $width;
        $effectiveHeight = $swap ? $width : $height;

        $ratio = $effectiveHeight / $effectiveWidth;

        return $ratio >= $aspectThreshold;
    }
}