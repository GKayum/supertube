import { api } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Channels() {
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, setUser } = useAuth()

    useEffect(() => {
        api.get('/api/v1/user/channels')
            .then(res => {
                setChannels(res.data.channels)
                setUser(prev => ({
                    ...prev,
                    subscriptions: res.data.channels,
                }))
            })
            .catch(() => {setChannels([])})
            .finally(() => {setLoading(false)})
    }, [])

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Мои подписки</h1>
            {loading ? (
                <div className="text-center text-gray-400">Загрузка...</div>
            ) : channels.length === 0 ? (
                <div className="text-gray-500 mt-12 text-center">
                    У вас нет подписок. <Link to="/" className="text-blue-600 hover:underline">Главная страница</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {channels.map(channel => (
                        <div
                            key={channel.id}
                            className="flex flex-col items-center bg-white rounded-xl shadow hover:shadow-lg transition p-6"
                        >
                            <Link to={`/channel/${channel.user_id}`}>
                                <img 
                                    src={channel.avatar} 
                                    alt={channel.title}
                                    className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
                                />
                            </Link>
                            <Link
                                to={`/channel/${channel.user_id}`}
                                className="mt-4 font-semibold text-lg text-center hover:underline truncate max-w-[150px]"
                                title={channel.title}
                            >
                                {channel.title}
                            </Link>
                            <div className="mt-1 text-gray-500 text-sm">
                                {channel.subscribers?.toLocaleString() ?? 0} подписчиков
                            </div>
                            <Link
                                to={`/channel/${channel.user_id}`}
                                className="mt-4 px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
                            >
                                Перейти на канал
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}