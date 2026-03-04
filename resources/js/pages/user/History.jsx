import { useEffect, useState } from "react";
import HistoryCard from "../../components/video/cards/HistoryCard";
import HistoryIcon from "../../icons/historyIcon";
import { api, handlerApiError } from "../../services/api"
import { Link } from "react-router-dom";

export default function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const response = await api.get('/api/v1/videos/history/views')
            setHistory(response.data.views)
        } catch (error) {
            handlerApiError(error, {setValidationErrors: () => {}, setError: () => {}})
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex items-center gap-3 mb-6">
                <HistoryIcon />
                <h1 className="text-2xl font-bold text-gray-800">История просмотров</h1>
            </div>
            {loading ? (
                <div className="text-gray-400 text-center mt-16">Загрузка истории...</div>
            ) : history.length === 0 ? (
                <div className="flex flex-col items-center mt-24">
                    <HistoryIcon />
                    <p className="mt-3 text-gray-500 text-lg">Вы еще не смотрели видео</p>
                    <Link
                        to="/"
                        className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
                    >
                        На главную
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {history.map((view) => (
                        <HistoryCard key={view.id} video={view.video} />
                    ))}
                </div>
            )}
        </div>
    )
}