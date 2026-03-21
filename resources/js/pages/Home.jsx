import { useEffect, useState } from "react";

import Toast from "../components/form/Toast"
import VideoCard from "../components/video/cards/VideoCard"
import { api } from "../services/api";
import ShortCard from "../components/short/ShortCard";

const FIRST_BLOCK_COUNT = 8

export default function Home() {
    const [videos, setVideos] = useState([])
    const [shorts, setShorts] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    useEffect(() => {
        fetchVideos()
        fetchShorts()
    }, [])

    const fetchVideos = async () => {
        try {
            const response = await api.get('/api/v1/videos')
            setVideos(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке списка видео:', error)            
        } finally {
            setLoading(false)
        }
    }

    const fetchShorts = async () => {
        try {
            const response = await api.get('/api/v1/videos/shorts')
            setShorts(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке списка шортсов:', error)            
        } finally {
            setLoading(false)
        }
    }

    const firstBlock = videos.slice(0, FIRST_BLOCK_COUNT)
    const restBlock = videos.slice(FIRST_BLOCK_COUNT)

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

                {restBlock.map(video => (
                    <VideoCard key={video.id} video={video} setToast={setToast} />
                ))}
            </div>
        </div>
    )
}