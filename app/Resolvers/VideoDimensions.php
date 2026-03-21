<?php

namespace App\Resolvers;

use Illuminate\Support\Facades\Process;

class VideoDimensions
{
    /**
     * Определяет ширину и высоту видео (с учётом rotation).
     * 
     * @param string $absolutePath Абсолютный путь к видеофайлу
     * @return array{width:int|null, height:int|null, rotation:int|null, effective_width:int|null, effective_height:int|null}
     */
    public function resolve(string $absolutePath): array
    {
        $cmd = [
            'ffprobe', '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height,rotation,side_data_list',
            '-of', 'json',

            $absolutePath,
        ];

        $res = Process::run($cmd);

        if (!$res->successful()) {
            return [
                'width' => null,
                'height' => null,
                'rotation' => null,
                'effective_width' => null,
                'effective_height' => null,
            ];
        }

        $json = json_decode($res->output(), true) ?: [];
        $stream = $json['streams'][0] ?? [];
        
        $width = $stream['width'] ?? null;
        $height = $stream['height'] ?? null;

        // rotation может быть отдельным ключом или в side_data_list
        $rotation = $stream['rotation'] ?? null;
        if ($rotation === null && !empty($stream['side_data_list'])) {
            foreach ($stream['side_data_list'] as $sd) {
                if (isset($sd['rotation'])) {
                    $rotation = (int) $sd['rotation'];
                    break;
                }
            }
        }

        // Определение "эффективной" геометрии: если rotate=90/270 > меняем местами
        $rot = ((int) ($rotation ?? 0)) % 360;
        $swap = in_array(abs($rot), [90, 270], true);

        $effectiveWidth = $swap ? $height : $width;
        $effectiveHeight = $swap ? $width : $height;

        return [
            'width' => $width,
            'height' => $height,
            'rotation' => $rotation,
            'effective_width' => $effectiveWidth,
            'effective_height' => $effectiveHeight,
        ];
    }
}

