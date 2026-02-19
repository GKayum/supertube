<?php

namespace App\Helpers;

class Search 
{
    public static function normalize(string $text): array {
        // Заменяет все символы в $text, которые не являются буквами или цифрами, на пробелы
        $text = preg_replace('/[^\p{L}\p{N}]/u', ' ', $text);
        $text = mb_strtolower($text);
        // Заменяет все последовательности пробелов на одинарный пробел
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);

        return array_filter(explode(' ', $text));
    } 
}