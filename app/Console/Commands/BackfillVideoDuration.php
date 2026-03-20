<?php

namespace App\Console\Commands;

use App\Models\Video;
use App\Resolvers\VideoDuration;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BackfillVideoDuration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'videos:backfill-duration {--limit=100 : Максимум записей за раз}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Поиск видео без duration, вычисление длительности видео и сохранение в БД.';

    /**
     * Execute the console command.
     */
    public function handle(VideoDuration $resolver): int
    {
        $limit = (int) $this->option('limit');

        $query = Video::query()
            ->whereNull('duration')
            ->orderBy('id');
    
        $total = (clone $query)->count();

        if ($total === 0) {
            $this->info('Нет видео с пустым duration.');

            return self::SUCCESS;
        }

        $this->info("Найдено {$total} видео без duration. Обработаем не более {$limit} за этот запуск.");

        $processed = 0;

        $query->limit($limit)->chunkById(10, function ($chunk) use (&$processed, $resolver) {
            $disk = Storage::disk('public');

            foreach ($chunk as $video) {
                $relativePath = $video->path;

                if (!$relativePath) {
                    $this->warn("Пустой path ({$video->id})");

                    continue;
                }

                $relativePath = Str::after($relativePath, '/storage/');

                if (!$disk->exists($relativePath)) {
                    $this->warn("Файл не найден ({$video->id}) path={$video->path} (нормализовано: {$relativePath})");

                    continue;
                }

                $absolutePath = $disk->path($relativePath);
                $duration = $resolver->resolve($absolutePath);

                if ($duration === null) {
                    $this->warn("Не удалось определить длительность ({$video->id}) {$relativePath}");

                    continue;
                }

                $this->line("ID {$video->id}: {$relativePath} → {$duration} сек.");

                $video->duration = $duration;

                // Метод saveQuietly() сохраняет модель в БД, не запуская события модели,
                // для избежания срабатывания наблюдателей (Observers) и слушателей событий
                $video->saveQuietly();

                $processed++;
            }
        });

        $this->info("Готово. Обработано: {$processed} видео.");

        return self::SUCCESS;
    }
}
