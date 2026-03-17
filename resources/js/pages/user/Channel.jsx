import { useEffect, useState } from "react";
import Avatar from "../../components/user/Avatar";
import { useParams } from "react-router-dom";
import { api, handlerApiError } from '../../services/api'
import NotFound from '../404'
import ChannelVideoCard from "../../components/video/cards/ChannelVideoCard";
import PlaylistCard from "../../components/playlist/PlaylistCard";

const TABS = [
    { key: 'videos',    label: 'Видео' },
    { key: 'playlists', label: 'Плейлисты' },
    { key: 'shorts',    label: 'Шортсы' },
    { key: 'posts',     label: 'Посты' },
    { key: 'streams',   label: 'Стримы' },
]

export default function Channel() {
    const { id } = useParams()
    const [channel, setChannel] = useState({})
    const [loading, setLoading] = useState(true)
    const [notChannel, setNotChannel] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [activeTab, setActiveTab] = useState('videos')

    const [playlists, setPlaylists] = useState([])
    const [playlistsLoading, setPlaylistsLoading] = useState(false)
    const [playlistsFetched, setPlaylistsFetched] = useState(false)
    const [playlistsError, setPlaylistsError] = useState('')

    useEffect(() => {
        setPlaylists([])
        setPlaylistsLoading(false)
        setPlaylistsFetched(false)
        setPlaylistsError('')
    }, [id])

    useEffect(() => {
        fetchChannel()
    }, [id])

    const fetchChannel = async () => {
        try {
            const response = await api.get('/api/v1/channel/' + id)
            setChannel(response.data)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNotChannel(true)
            }

            console.log('Ошибка при загрузке данных канала: ', error);
            handlerApiError(error, {setValidationErrors: () => {}, setError: () => {}})
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab !== 'playlists' || playlistsFetched || playlistsLoading) return

        const run = async () => {
            setPlaylistsLoading(true)
            setPlaylistsError('')
            try {
                const response = await api.get(`/api/v1/channel/${id}/playlists`)
                
                setPlaylists(response.data.data || [])
                setPlaylistsFetched(true)
            } catch (error) {
                setPlaylistsError('Не удалось загрузить плейлисты')
            } finally {
                setPlaylistsLoading(false)
            }
        }
        run()
    }, [activeTab, id, playlistsFetched, playlistsLoading])

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка данных...</p>
    }

    if (notChannel) {
        return <NotFound />
    }

    // Обрезка описания
    const description = channel.description || ''
    const isLongDescription = description.length > 500
    const shortDescription = isLongDescription ? description.slice(0, 500) + '...' : description
    
    return (
        <main className="bg-white rounded shadow">

            <div className="relative h-48 md:h-60 bg-gray-200 overflow-hidden">
                <img 
                    src={channel.cover} 
                    alt="Обложка канала" 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative px-4">
                <div className="absolute -top-12 md:-top-16 left-4 flex items-end">
                    <Avatar user={channel} text={'text-8xl'} classes={'md:w-32 md:h-32 border-4 border-black shadow'} />
                    <div className="ml-4 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold">{channel.title}</h1>
                        <p className="text-gray-600">{channel.subscribers ?? 0} подписчиков</p>
                    </div>
                </div>
                <div className="pt-16 md:pt-20"></div>
            </div>

            <div className="px-4">
                <div id="description" className="text-gray-700 overflow-hidden transition-all duration-300 whitespace-pre-line">
                    {isLongDescription
                        ? showFullDescription
                            ? description
                            : shortDescription
                        : description}
                </div>
                {isLongDescription && (
                    <button
                        onClick={() => setShowFullDescription(v => !v)}
                        className="text-blue-600 mt-2 hover:underline"
                    >
                        {showFullDescription ? 'Скрыть' : 'Показать полностью'}
                    </button>
                )}
            </div>

            <nav className="border-b mt-4">
                <ul className="flex gap-6 px-4 overflow-x-auto">
                    {TABS.map(tab => (
                        <li key={tab.key}>
                            <button
                                type="button"
                                className={
                                    "block py-4 font-semibold transition-all duration-150 cursor-pointer " +
                                    (activeTab === tab.key
                                        ? "border-red-600 text-red-600"
                                        : "border-transparent hover:text-red-600"
                                    )
                                }
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <section className="px-4 py-8">
                {activeTab === 'videos' && (
                    (channel.videos.length === 0
                        ? (<div className="text-gray-500">Нет видео на этом канале</div>)
                        : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {channel.videos.map(video => (
                                <ChannelVideoCard key={`video-card-${video.id}`} video={video} />
                            ))}
                        </div>)
                    )
                )}
                {activeTab === 'playlists' && (
                    <>
                        {playlistsLoading && <div className="text-gray-500">Загрузка плейлистов...</div>}

                        {!playlistsLoading && playlistsError && (
                            <div className="text-red-500">{playlistsError}</div>
                        )}

                        {!playlistsLoading && !playlistsError && (
                            playlists.length === 0
                                ? <div className="text-gray-500">На канале нет плейлистов</div>
                                : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                                        {playlists.map(pl => (
                                            <PlaylistCard playlist={pl} />
                                        ))}
                                    </div>
                                )
                        )}
                    </>
                )}
                {activeTab === 'shorts' && (
                    <div>Шортсы...</div>
                )}
                {activeTab === 'posts' && (
                    <div>Посты...</div>
                )}
                {activeTab === 'streams' && (
                    <div>Стримы...</div>
                )}
            </section>


        </main>
    )
}