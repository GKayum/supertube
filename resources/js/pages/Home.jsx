import axios from "axios";
import React, { useEffect, useState } from "react";
import VideoCard from '../components/video/cards/VideoCard'

export default function Home() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            const response = await axios.get('/api/v1/videos')
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    )
}