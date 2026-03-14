<?php

namespace App\Console\Commands;

use App\Enums\VideoStatus;
use App\Models\Video;
use Illuminate\Console\Command;

class PublishScheduledVideos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'videos:publish-scheduled {--chunk=100}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Публикация запланированного видео, при наступлении времени публикации';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $chunk = (int) $this->option('chunk');

        Video::dueToPublish()
            ->orderBy('scheduled_at')
            ->chunkById($chunk, function ($videos) {
                foreach ($videos as $video) {
                    $video->status = VideoStatus::Published;
                    $video->save();

                    $this->line("Published #{$video->id}");
                }
            });
        
        return self::SUCCESS;
    }
}
