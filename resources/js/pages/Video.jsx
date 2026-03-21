import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { getFingerprint } from "../services/fingerprint";
import SimilarVideoCard from '../components/video/cards/SimilarVideoCard'
import Comment from '../components/video/Comment'
import CommentForm from '../components/form/CommentForm'
import ViewTracker from "../components/wrappers/ViewTracker";
import Avatar from "../components/user/Avatar";
import NotFound from "./404";
import Toast from "../components/form/Toast";
import { usePlaylist } from "../components/playlist/usePlaylist";
import PlaylistTopbar from "../components/playlist/PlaylistTopbar";
import PlaylistSidebar from "../components/playlist/PlaylistSideBar";

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
    const [notVideo, setNotVideo] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subLoading, setSubLoading] = useState(false)
    const [subscribers, setSubscribers] = useState(0)
    const [toast, setToast] = useState({visible: false, message: '', type: 'info'})
    const [searchParams] = useSearchParams()
    const listId = searchParams.get('list')
    const navigate = useNavigate()

    const {
        playlist,
        items: playlistItems,
        loading: loadingPlaylist,
        activeIndex,
        count: playlistCount,
        title: playlistTitle
    } = usePlaylist(listId, video.id)

    const navigateToVideoInPlaylist = (targetVideoId) => {
        if (String(targetVideoId) === String(video.id)) return
        
        const next = new URLSearchParams(searchParams)

        if (listId) next.set('list', listId)

        navigate(`/video/${targetVideoId}?${next.toString()}`, { replace: false })
    }

    const goPrev = () => {
        if (activeIndex > 0) navigateToVideoInPlaylist(playlistItems[activeIndex - 1].id)
    }

    const goNext = () => {
        if (activeIndex >= 0 && activeIndex < playlistCount - 1) {
            navigateToVideoInPlaylist(playlistItems[activeIndex + 1].id)
        }
    }

    // Подписка
    const processSubs = async (type, isSubscribed) => {
        setSubLoading(true)
        try {
            const response = await api.post(`/api/v1/channel/${video.channel.id}/${type}`)
            setIsSubscribed(isSubscribed)
            setSubscribers(response.data.subscribers)
        } catch (error) {
            setToast({ visible: true, message: error.response?.data?.message || error, type: 'error' })
        } finally {
            setSubLoading(false)
        }
    }

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await api.get(`/api/v1/videos/${id}`)
                setVideo(response.data)
                setIsSubscribed(response.data?.channel.isSubscribed)
                setSubscribers(response.data?.channel.subscribers)
                setViews(response.data.views)
                
                const realId = response.data.id
                
                const [similarRes, commentsRes, likesRes] = await Promise.all([
                    api.get('/api/v1/videos/' + realId + '/similar'),
                    api.get('/api/v1/videos/' + realId + '/comments'),
                    api.get('/api/v1/videos/' + realId + '/likes'),
                ])

                setSimilarVideos(similarRes.data)
                setComments(commentsRes.data.comments)
                setCommentsCount(commentsRes.data.count)
                setLikesCount(likesRes.data.likes)
                setDislikesCount(likesRes.data.dislikes)
            } catch (error) {
                console.log(error);
                
                if (error.response && error.response.status === 404) {
                    setNotVideo(true)
                }

                setToast({ visible: true, message: error.response?.data?.message || error, type: 'error' })
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
            const fingerprint = await getFingerprint()

            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/videos/' + id + '/' + type, {fingerprint})

            setLikesCount(response.data.likes)
            setDislikesCount(response.data.dislikes)
        } catch (error) {
            setToast({ visible: true, message: error.response?.data?.message || error, type: 'error' })
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

            <Toast 
                {...toast}
                onClose={() => setToast(t => ({ ...t, visible: false }))}
            />

            {/* Левая колонка - основное видео и информация */}
            <div className="flex-1 min-w-0">
                {loading || userLoading ? (
                    // <p className="text-gray-500">Загрузка видео...</p>
                    <div style={{backgroundColor: '#262627'}} className="w-full aspect-video rounded-xl"></div>
                ) : (
                    <ViewTracker key={video.id} videoId={video.id} initialViews={views}>
                        {({views, handlePlay}) => (
                            <>
                                {listId && (
                                    <PlaylistTopbar 
                                        title={playlistTitle}
                                        activeIndex={activeIndex}
                                        count={playlistCount}
                                        onPrev={goPrev}
                                        onNext={goNext}
                                    />
                                )}

                                {/* Видео плеер */}
                                <div key={`player-${video.id}`} className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                                    <video
                                        key={`video-${video.id}`}
                                        className="w-full h-full"
                                        controls
                                        muted={false}
                                        autoPlay={false}
                                        onPlay={handlePlay}
                                        preload="metadata"
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
                                                onClick={() => processSubs(isSubscribed ? 'unsubscribe' : 'subscribe', !isSubscribed)}
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
                                <div className="mt-4 bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-line">
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
                {listId && playlistTitle && (
                    <PlaylistSidebar
                        playlist={playlist}
                        currentVideoId={video.id}
                        loading={loadingPlaylist}
                        onSelectVideo={navigateToVideoInPlaylist}
                    />
                )}

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