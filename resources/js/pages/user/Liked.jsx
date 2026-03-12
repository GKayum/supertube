import { api } from "../../services/api";
import Toast from "../../components/form/Toast";
import VideoCardLiked from "../../components/video/cards/VideoCardLiked";
import { useEffect, useState } from "react";

export default function Liked() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    useEffect(() => {
        api.get('/api/v1/user/liked')
            .then(res => setVideos(res.data.videos))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="py-12 text-center text-gray-400">Загрузка данных...</div>
    }

    if (videos.length === 0) {
        return <div className="py-12 text-center text-gray-400">Нет видео в списке "Понравившиеся"</div>
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Toast 
                {...toast}
                onClose={() => setToast(t => ({...t, visible: false}))}
            />
            <h1 className="text-2xl font-bold mb-6">Понравившиеся</h1>
            <ul className="space-y-4">
                {videos.map((video) => (
                    <VideoCardLiked key={video.id} video={video} setToast={setToast} />
                ))}
            </ul>
        </div>
    )
}