<?php

namespace App\Services;

use App\Enums\VideoStatus;
use App\Models\Video;
use App\Services\Contracts\ShortServiceContract;
use Illuminate\Support\Collection;

class ShortService implements ShortServiceContract
{
    public function firstWithRandom(int $firstId, int $limit, ?int $authorId): Collection
    {
        $first = Video::query()
            ->when($authorId, fn($q) => $q->where('user_id', $authorId))
            ->findOrFail($firstId);

        // Исключение определенного видео
        $exclude = [$first->id];

        $random = Video::query()
            ->shorts()
            ->where('status', VideoStatus::Published)
            ->when($authorId, fn($q) => $q->where('user_id', $authorId))
            ->whereNotIn('id', $exclude)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
        
        // Объединение первого видео $first с случайными элементами $random через merge()
        return collect([$first])->merge($random);
    }

    public function randomBatch(int $limit, array $exclude, ?int $authorId): Collection
    {
        // (array_values()) возвращает индексный массив значений ["size" => "XL", "color" => "gold"] → [0 => "XL", 1 => "gold"]
        // (array_unique()) удаляет повторящиеся значения из массива ["a" => "green", "red", "b" => "green", "blue", "red"] → ["a" => "green", 0 => "red", 1 => "blue"]
        // (array_map('intval', ...)) перебирает элементы массива и приводит к целому числу ('intval')
        $exclude = array_values(array_unique(array_map('intval', $exclude)));

        // Возвращает коллекцию случайных видео (shorts) с возможностью исключить определенные ID (when($exclude, ...))
        // и фильтрацией по автору (when($authorId, ...))
        return Video::query()
            ->shorts()
            ->where('status', VideoStatus::Published)
            ->when($authorId, fn($q) => $q->where('user_id', $authorId))
            // TODO optimize
            ->when($exclude, fn($q) => $q->whereNotIn('id', $exclude))
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }
}