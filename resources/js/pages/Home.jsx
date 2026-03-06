import { useEffect, useState } from "react";

import Toast from "../components/form/Toast"
import VideoCard from "../components/video/cards/VideoCard"
import { api } from "../services/api";

export default function Home() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    useEffect(() => {
        fetchVideos()
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
                {videos.map(video => (
                    <VideoCard key={video.id} video={video} setToast={setToast} />
                ))}
            </div>
        </div>
    )
}