<?php

namespace App\Resolvers;

use Exception;
use Illuminate\Support\Facades\Process;

class VideoDuration
{
    public function resolve(string $absolutePath): ?int
    {
        if (!is_file($absolutePath)) {
            return null;
        }

        try {
            $cmd = [
                'ffprobe', '-v', 'error',
                '-show_entries', 'format=duration',
                '-of', 'default=nokey=1:noprint_wrappers=1',

                $absolutePath,
            ];

            $result = Process::run($cmd);

            if ($result->successful()) {
                $out = trim($result->output());

                if ($out !== '' && is_numeric($out)) {
                    return (int) round((float) $out);
                }
            }
        } catch (Exception $e) {

        }

        return null;
    }
}