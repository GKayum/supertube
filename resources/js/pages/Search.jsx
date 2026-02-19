import { useEffect, useState } from "react"
import SearchCard from "../components/video/SearchCard"
import { api, handlerApiError } from "../services/api"
import { useLocation } from "react-router-dom"

export default function SearchResultList() {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const q = params.get('q') || ''
        setQuery(q)

        if (q.length < 2) {
            setResults([])
            return
        }

        setLoading(true)
        api.get(`/api/v1/videos/search?q=${encodeURIComponent(q)}`)
            .then((res) => setResults(res.data))
            .catch((err) => handlerApiError(err, {}))
            .finally(() => setLoading(false))
    }, [location.search])

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Загрузка видео...</p>
    }

    return (
        <div className="flex flex-col gap-6 items-center">
            <h2 className="text-xl font-semibold mb-4">
                Результат поиска по запросу: <span className="text-blue-600">{query}</span>
            </h2>
            {results.map(video => (
                <SearchCard key={video.id} video={video} />
            ))}
        </div>
    )
}