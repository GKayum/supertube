import { useEffect, useState } from "react";

import Toast from "../components/form/Toast"
import VideoCard from "../components/video/cards/VideoCard"
import { api } from "../services/api";
import ShortCard from "../components/short/ShortCard";
import EntryCardHome from "../components/entry/EntryCardHome";

const FIRST_BLOCK_COUNT = 8
const AFTER_SHORTS_COUNT = 8

export default function Home() {
    const [videos, setVideos] = useState([])
    const [shorts, setShorts] = useState([])
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    useEffect(() => {
        (async () => {
            try {
                const [videoRes, shortRes, entryRes] = await Promise.all([
                    api.get('/api/v1/videos'),
                    api.get('/api/v1/videos/shorts'),
                    api.get('/api/v1/entries'),
                ])
                setVideos(videoRes.data ?? [])
                setShorts(shortRes.data ?? [])
                setEntries((entryRes.data.data ?? []))
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    // Отображение видео: 8 до шортсов, 8 после, и остальное
    const firstBlock = videos.slice(0, FIRST_BLOCK_COUNT)
    const afterShortsBlock = videos.slice(FIRST_BLOCK_COUNT, FIRST_BLOCK_COUNT + AFTER_SHORTS_COUNT)
    const restBlock = videos.slice(FIRST_BLOCK_COUNT + AFTER_SHORTS_COUNT)

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка видео...</p>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Toast
                {...toast}
                onClose={() => setToast(t => ({...t, visible: false}))}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {firstBlock.map(video => (
                    <VideoCard key={video.id} video={video} setToast={setToast} />
                ))}

                {/* Список шортсов */}
                {shorts.length > 0 && (
                    <div className="col-span-full">
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {shorts.map(short => (
                                <ShortCard
                                    key={`short-${short.id}`}
                                    id={short.id}
                                    title={short.title}
                                    coverUrl={short.preview480}
                                    videoUrl={short.path}
                                    views={short.views ?? 0}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {afterShortsBlock.map(video => (
                    <VideoCard key={video.id} video={video} setToast={setToast} />
                ))}

                {entries.length > 0 && (
                    <>
                        <div className="col-span-full">
                            <h2 className="text-lg font-semibold">Записи каналов</h2>
                        </div>
                        {entries.map((entry) => (
                            <EntryCardHome key={entry.id} entry={entry} />
                        ))}
                    </>
                )}

                {restBlock.map(video => (
                    <VideoCard key={video.id} video={video} setToast={setToast} />
                ))}
            </div>
        </div>
    )
}