<?php

namespace App\Enums;

enum VideoStatus: string
{
    case Draft      = 'draft';      // Видео загружено, но еще не опубликовано
    case Published  = 'published';  // Видео опубликовано, доступно всем
    case Processing = 'processing'; // Видео загружено, но еще обрабатывается
    case Scheduled  = 'scheduled';  // Видео запланировано к публикации
    case Blocked    = 'blocked';    // Видео заблокировано
    case Private    = 'private';    // Видео видит только владелец
    case Hidden     = 'hidden';     // Видео не отображается в общем списке, но доступно по ссылке
    case Archived   = 'archived';   // Видео не актуально, скрыто, но не удалено
    case Deleted    = 'deleted';    // Видео помечено как удаленное

    public function label(): string
    {
        return match($this) {
            self::Draft      => 'Черновик',
            self::Published  => 'Опубликовано',
            self::Processing => 'Обработка',
            self::Scheduled  => 'Отложенная публикация',
            self::Blocked    => 'Заблокировано',
            self::Private    => 'Приватное',
            self::Hidden     => 'Доступ по ссылке',
            self::Archived   => 'В архиве',
            self::Deleted    => 'Удалено',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        $out = [];
        foreach (self::cases() as $case) {
            $out[$case->value] = $case->label();
        }

        return $out;
    }

    public static function userAvialable(): array
    {
        $cases = [
            self::Published,
            self::Scheduled,
            self::Private,
            self::Hidden,
            self::Archived,
        ];

        $out = [];
        foreach ($cases as $case) {
            $out[$case->value] = $case->label();
        }

        return $out;
    }
}