import { useEffect, useState } from "react";
import { api, handlerApiError } from '../../services/api'
import PlaylistMyCard from "../../components/playlist/PlaylistMyCard";

export default function MyPlaylists() {
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPlaylists()
    }, [])

    const fetchPlaylists = async () => {
        try {
            const { data } = await api.get('/api/v1/user/playlists')
            setPlaylists(Array.isArray(data) ? data : data.data ?? [])
        } catch (error) {
            handlerApiError(error, { setValidationErrors: () => {}, setError: () => {} })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка плейлистов...</p>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Мои плейлисты</h1>

            {playlists.length === 0 ? (
                <div className="text-gray-500">У вас нету плейлистов</div>
            ) : (
                <div className="space-y-6">
                    {playlists.map((pl) => (
                        <PlaylistMyCard key={pl.id} playlist={pl} />
                    ))}
                </div>
            )}
        </div>
    )
}