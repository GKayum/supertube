import { useEffect, useState } from "react";

import { api } from "../../services/api";
import VideoCard from "../../components/user/VideoCard";

export default function MyVideos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Изоляция асинхронной функции, чтобы не попадало в глобальную область видимости
        (async () => {
            try {
                const response = await api.get('/api/v1/user/videos')
                setVideos(response.data)
            } catch (error) {
                console.error('Ошибка при загрузке видео: ', error);
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка видео...</p>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Мои видео</h1>

            <div className="space-y-6">
                {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    )
}