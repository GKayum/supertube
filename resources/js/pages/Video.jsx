import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from '../contexts/AuthContext'
import { api, handlerApiError } from '../services/api'
import SimilarVideoCard from '../components/video/SimilarVideoCard'
import Comment from '../components/video/Comment'
import CommentForm from '../components/form/CommentForm'
import ViewTracker from "../components/wrappers/ViewTracker";
import Avatar from "../components/user/Avatar";
import NotFound from "./404";

export default function Video() {
    const { id } = useParams()
    const { user, userLoading } = useAuth()
    const [video, setVideo] = useState({})
    const [similarVideos, setSimilarVideos] = useState([])
    const [comments, setComments] = useState([])
    const [commentsCount, setCommentsCount] = useState(0)
    const [likesCount, setLikesCount] = useState(0)
    const [dislikesCount, setDislikesCount] = useState(0)
    const [views, setViews] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingSimilar, setLoadingSimilar] = useState(true)
    const [loadingComments, setLoadingComments] = useState(true)
    const [error, setError] = useState('')
    const [notVideo, setNotVideo] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subLoading, setSubLoading] = useState(false)
    const [subscribers, setSubscribers] = useState(0)

    const subscribe = async () => {
        setSubLoading(true)
        try {
            const response = await api.post(`/api/v1/channel/${video.channel.id}/subscribe`)
            setIsSubscribed(true)
            setSubscribers(response.data.subscribers)
        } catch (error) {
            handlerApiError(error, { setValidationErrors: () => {}, setError})
        } finally {
            setSubLoading(false)
        }
    }

    const unsubscribe = async () => {
        setSubLoading(true)
        try {
            const response = await api.post(`/api/v1/channel/${video.channel.id}/unsubscribe`)
            setIsSubscribed(false)
            setSubscribers(response.data.subscribers)
        } catch (error) {
            handlerApiError(error, { setValidationErrors: () => {}, setError})
        } finally {
            setSubLoading(false)
        }
    }

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [videoRes, similarRes, commentsRes, likesRes] = await Promise.all([
                    api.get('/api/v1/videos/' + id),
                    api.get('/api/v1/videos/' + id + '/similar'),
                    api.get('/api/v1/videos/' + id + '/comments'),
                    api.get('/api/v1/videos/' + id + '/likes'),
                ])

                setVideo(videoRes.data)
                setSimilarVideos(similarRes.data)
                setIsSubscribed(videoRes.data.channel?.isSubscribed)
                setSubscribers(videoRes.data.channel?.subscribers)
                setComments(commentsRes.data.comments)
                setCommentsCount(commentsRes.data.count)
                setLikesCount(likesRes.data.likes)
                setDislikesCount(likesRes.data.dislikes)
                setViews(videoRes.data.views)
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setNotVideo(true)
                }

                console.error('Ошибка при загрузке данных: ', error);
                handlerApiError(error, {setValidationErrors: () => {}, setError})
            } finally {
                setLoading(false)
                setLoadingSimilar(false)
                setLoadingComments(false)
            }
        }

        fetchAll()
    }, [id])

    const rateHandler = async (type) => {
        try {
            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/videos/' + id + '/' + type)

            setLikesCount(response.data.likes)
            setDislikesCount(response.data.dislikes)
        } catch (error) {
            console.log('Ошибка при попытке лайкнуть/дизлайкнуть видео: ' + error)
            handlerApiError(error, { setValidationErrors: () => {}, setError })
        }
    }

    if (loading) {
        return
    }

    if (notVideo) {
        return <NotFound />
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">

            {/* Левая колонка - основное видео и информация */}
            <div className="flex-1 min-w-0">

                {error && (
                    <div className="mb-4 w-full h-12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Ошибка:</strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {loading ? (
                    // <p className="text-gray-500">Загрузка видео...</p>
                    <div style={{backgroundColor: '#262627'}} className="w-full aspect-video rounded-xl"></div>
                ) : (
                    <ViewTracker videoId={video.id} initialViews={views}>
                        {({views, handlePlay}) => (
                            <>
                                {/* Видео плеер */}
                                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                                    <video
                                        key={video.id}
                                        className="w-full h-full"
                                        controls
                                        muted={false}
                                        autoPlay={false}
                                        onPlay={handlePlay}
                                    >
                                        <source src={video.path}/>
                                        Ваш браузер не поддерживает видео.
                                    </video>
                                </div>

                                {/* Заголовок */}
                                <h1 className="mt-4 text-2xl font-semibold text-gray-900">
                                    {video.title}
                                </h1>

                                {/* Автор и кнопки */}
                                <div className="mt-2 flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <Avatar user={video.user} />

                                        <div>
                                            <p className="text-gray-900 font-medium">{video.user.name}</p>
                                            <p className="text-sm text-gray-500">{subscribers ?? 0} подписчиков</p>
                                        </div>
                                        {user && user.channel?.id !== video.channel?.id && (
                                            <button
                                                className={`ml-4 px-4 py-2 rounded font-medium text-sm transition cursor-pointer ${
                                                    isSubscribed
                                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        : 'bg-red-600 text-white hover:bg-red-700'    
                                                }`}
                                                onClick={isSubscribed ? unsubscribe : subscribe}
                                                disabled={subLoading}
                                            >
                                                {subLoading
                                                    ? '...'
                                                    : isSubscribed
                                                        ? 'Отписаться'
                                                        : 'Подписаться'
                                                }
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => rateHandler('like')}
                                            className="flex items-center bg-gray-200 hover:bg-gray-300 text-sm font-semibold px-4 py-2 rounded cursor-pointer"
                                        >
                                            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
                                                <path d="M7 10v12"/>
                                            </svg>
                                            {likesCount}
                                        </button>
                                        <button
                                            onClick={() => rateHandler('dislike')}
                                            className="flex items-center bg-gray-200 hover:bg-gray-300 text-sm font-semibold px-4 py-2 rounded cursor-pointer"
                                        >
                                            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>
                                                <path d="M17 14V2"/>
                                            </svg>
                                            {dislikesCount}
                                        </button>
                                        <div className="flex items-center bg-gray-100 text-sm font-medium px-4 py-2 rounded text-gray-600 select-none">
                                            <svg className="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                            {views} просмотров
                                        </div>
                                        {/* <button className="bg-gray-200 hover:bg-gray-300 text-sm font-semibold px-4 py-2 rounded cursor-pointer">
                                            🔄️ Поделиться
                                        </button> */}
                                    </div>
                                </div>

                                {/* Описание */}
                                <div className="mt-4 bg-gray-100 p-4 rounded-lg text-sm text-gray-800">
                                    {video.description}
                                </div>
                            </>
                        )}
                    </ViewTracker>
                )}

                {/* Комментарии */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Комментарии ({commentsCount})
                    </h2>

                    <div className="space-y-6">
                        {loadingComments ? (
                            <p className="text-gray-500">Загрузка комментариев...</p>
                        ) : (
                            comments.map(comment => (
                                <Comment key={comment.id} comment={comment} />
                            ))
                        )}
                    </div>

                    {user && (
                        <CommentForm videoId={id} setCommentList={setComments} setCommentsCount={setCommentsCount} />
                    )}
                </div>
            </div>

            {/* Правая колонка - список похожих видео */}
            <aside className="w-full lg:w-80 shrink-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Другие видео
                </h3>

                <div className="space-y-4">

                    {loadingSimilar ? (
                        <p className="text-gray-500">Загрузка похожих видео...</p>
                    ) : (
                        similarVideos.map(simVideo => (
                            <SimilarVideoCard key={simVideo.id} video={simVideo} />
                        ))
                    )}

                </div>
            </aside>

        </div>
    )
}