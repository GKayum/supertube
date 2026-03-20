<?php

use App\Console\Commands\BackfillVideoDuration;
use App\Console\Commands\PublishScheduledVideos;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command(PublishScheduledVideos::class)->everyMinute();
Schedule::command(BackfillVideoDuration::class)->everyMinute()->withoutOverlapping();
