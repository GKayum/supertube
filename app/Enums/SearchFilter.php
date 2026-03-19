<?php

namespace App\Enums;

enum SearchFilter: string
{
    case EmptyValue = '';

    // Дата загрузки
    case DateHour  = 'hour';
    case DateToday = 'today';
    case DateWeek  = 'week';
    case DateMonth = 'month';
    case DateYear  = 'year';

    // Тип
    case TypeVideo    = 'video';
    case TypeChannel  = 'channel';
    case TypePlaylist = 'playlist';
    case TypeMovie    = 'movie';

    // Длительность
    case DurationShort = 'short';
    case DurationMedium = 'medium';
    case DurationLong = 'long';

    // Порядок
    case OrderRelevance = 'relevance';
    case OrderDate = 'date';
    case OrderViews = 'views';
    case OrderRating = 'rating';

    public static function lists(): array
    {
        return [
            'date' => [
                ['key' => self::EmptyValue->value, 'label' => 'За всё время'],
                ['key' => self::DateHour->value,   'label' => 'За последний час'],
                ['key' => self::DateToday->value,  'label' => 'Сегодня'],
                ['key' => self::DateWeek->value,   'label' => 'За эту неделю'],
                ['key' => self::DateMonth->value,  'label' => 'За этот месяц'],
                ['key' => self::DateYear->value,   'label' => 'За этот год'],
            ],
            'type' => [
                ['key' => self::TypeVideo->value,    'label' => 'Видео'],
                ['key' => self::TypeChannel->value,  'label' => 'Каналы'],
                ['key' => self::TypePlaylist->value, 'label' => 'Плейлисты'],
                ['key' => self::TypeMovie->value,    'label' => 'Фильмы'],
            ],
            'duration' => [
                ['key' => self::EmptyValue->value,     'label' => 'Любая'],
                ['key' => self::DurationShort->value,  'label' => 'Менее 10 сек'],
                ['key' => self::DurationMedium->value, 'label' => '10 сек - 1 мин'],
                ['key' => self::DurationLong->value,   'label' => 'Больше минуты'],
            ],
            'order' => [
                ['key' => self::OrderRelevance->value, 'label' => 'По релевантности'],
                ['key' => self::OrderDate->value,      'label' => 'По дате загрузки'],
                ['key' => self::OrderViews->value,     'label' => 'По числу просмотров'],
                ['key' => self::OrderRating->value,    'label' => 'По рейтингу'],
            ],
        ];
    }
}