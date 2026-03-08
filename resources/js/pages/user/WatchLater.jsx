import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";
import VideoCardLater from "../../components/video/cards/VideoCardLater";
import Toast from "../../components/form/Toast";

export default function WatchLater() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    useEffect(() => {
        api.get('/api/v1/user/watch-later')
            .then(res => setVideos(res.data.videos))
            .finally(() => setLoading(false))
    }, [])

    const saveOrder = async (newVideos) => {
        try {
            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/user/watch-later/order', { order: newVideos.map(v => v.id) })
            setToast({ visible: true, message: response.data.message })
        } catch (error) {
            setToast({ visible: true, message: error.toString(), type: 'error' })
        }
    }

    const handleDragEnd = result => {
        if (!result.destination) return

        const reordered = Array.from(videos)
        const [removed] = reordered.splice(result.source.index, 1)

        reordered.splice(result.destination.index, 0, removed)

        setVideos(reordered)
        saveOrder(reordered)
    }

    if (loading) {
        return <div className="py-12 text-center text-gray-400">Загрузка данных...</div>
    }

    if (videos.length === 0) {
        return <div className="py-12 text-center text-gray-400">Нет видео в "Смотреть позже"</div>
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Toast
                {...toast}
                onClose={() => setToast(t => ({...t, visible: false}))}
            />
            <h1 className="text-2xl font-bold mb-6">Смотреть позже</h1>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="watch-later-list">
                    {(provided) => (
                        <ul
                            className="space-y-4"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {videos.map((video, idx) => (
                                <VideoCardLater key={video.id} video={video} idx={idx} />
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}