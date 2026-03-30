import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api";
import { useEffect, useState } from "react";
import Toast from "../components/form/Toast"
import NotFound from "./404"
import EntryComments from "../components/entry/EntryComments";

export default function Entry() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [entry, setEntry] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [dislikesCount, setDislikesCount] = useState(0)
    const [commentsCount, setCommentsCount] = useState(0)
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const response = await api.get(`/api/v1/entries/${id}`)
                setEntry(response.data.data)
                setLikesCount(response.data.data.likes || 0)
                setDislikesCount(response.data.data.dislikes || 0)
                setCommentsCount(response.data.data.commentsCount || 0)
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setNotFound(true)
                } else {
                    setToast({ visible: true, message: 'Ошибка при загрузке записи', type: 'error' })
                    console.log(error);
                }
            } finally {
                setLoading(false)
            }
        }

        fetchEntry()
    }, [id])

    const handleChannelClick = () => {
        navigate(`/channel/${entry.channelId}`)
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center text-gray-500">Загрузка записи...</div>
            </div>
        )
    }

    if (notFound) {
        return <NotFound />
    }

    if (!entry) {
        return <NotFound />
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Toast 
                {...toast}
                onClose={() => setToast(t => ({...t, visible: false}))}
            />

            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
                {/* SVG */}
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
            </button>

            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                            {entry.channelAvatar ? (
                                <img   
                                    src={entry.channelAvatar}
                                    alt="Аватар канала"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                                    🎬
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <button
                                onClick={handleChannelClick}
                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                {entry.channelTitle || "Неизвестный канал"}
                            </button>
                            <div className="text-sm text-gray-500">
                                {entry.timeAgo}
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        {entry.title || 'Без заголовка'}
                    </h1>
                </div>

                <div className="p-6">
                    <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {entry.description || 'Описание отсутствует'}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => {}}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                        >
                            <img src="/icons/like-dark-sm.svg" />
                            <span className="font-medium">{likesCount}</span>
                        </button>

                        <button
                            onClick={() => {}}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                        >
                            <img src="/icons/dislike-dark-sm.svg" />
                            <span className="font-medium">{dislikesCount}</span>
                        </button>

                        <div className="flex items-center space-x-2 px-4 py-2 text-gray-600">
                            <img src="/icons/comment-dark-sm.svg" />
                            <span className="font-medium">{commentsCount}</span>
                        </div>
                    </div>
                </div>
            </article>

            <EntryComments entryId={id} />
        </div>
    )
}