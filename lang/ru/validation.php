<?php

return [
    'required' => 'Поле :attribute обязательно для заполнения.',
    'max' => [
        'file' => 'Размер файла в поле :attribute не должен превышать :max килобайт.',
        'string' => 'Поле :attribute не должно превышать :max символов.',
    ],
    'min' => [
        'string' => 'Поле :attribute должно содержать минимум :min символов.',
    ],
    'confirmed' => 'Поле подтверждения :attribute не совпадает.',
    'email' => 'Поле :attribute должно быть корректным email адресом.',
    'string' => 'Поле :attribute должно быть строкой.',
    'unique' => 'Поле :attribute уже занято.',
    'image' => 'Файл должен быть изображением.',
    'mimes' => 'Допустимые форматы: jpg, jpeg, png, webp.',
    'dimensions' => 'Изображение должно быть указанного размера.',
];