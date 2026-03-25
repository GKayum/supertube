import { useEffect, useMemo, useState } from "react"
import SearchCard from "../components/video/cards/SearchCard"
import { api, handlerApiError } from "../services/api"
import { useLocation } from "react-router-dom"
import FiltersPanel from "../components/search/FiltersPanel"
import PlaylistSearchCard from "../components/playlist/PlaylistSearchCard"
import ShortCard from "../components/short/ShortCard"

const FIRST_BLOCK_COUNT = 3

export default function SearchResultList() {
    const location = useLocation()
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [shorts, setShorts] = useState([])

    const [filters, setFilters] = useState({
        date: '',
        type: 'video',
        duration: '',
        order: 'relevance',
    })

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const q = params.get('q') || ''
        
        setQuery(q)
    }, [location.search])

    const searchUrl = useMemo(() => {
        const params = new URLSearchParams()

        params.set('q', query)

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null) params.set(key, value)
        })

        return `/api/v1/videos/search?${params.toString()}`
    }, [query, filters])

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([])
            setLoading(false)
            return
        }

        setLoading(true)
        api.get(searchUrl)
            .then(res => setResults(res.data))
            .catch(err => handlerApiError(err, {}))
            .finally(() => setLoading(false))

        fetchShorts()
    }, [query, searchUrl])

    const fetchShorts = async () => {
        try {
            const response = await api.get('/api/v1/videos/shorts')
            setShorts(response.data.slice(0, 4))
        } catch (error) {
            console.error('Ошибка при загрузке шортсов:', error)
        } finally {
            setLoading(false)
        }
    }

    const firstBlock = results.slice(0, FIRST_BLOCK_COUNT)
    const restblock = results.slice(FIRST_BLOCK_COUNT)

    return (
        <div className="max-w-6xl mx-auto w-full px-4">
            <h2 className="text-xl font-semibold mt-4 mb-3">
                Результаты по запросу: {' '}
                <span className="text-blue-600 wrap-break-word">{query}</span>
            </h2>

            <div className="mb-6">
                <FiltersPanel 
                    value={filters}
                    onChange={setFilters}
                    defaultOpen={false}
                    className="mb-6"
                />
            </div>

            {loading ? (
                <p className="text-center text-gray-500 mt-10">Загрузка видео...</p>
            ) : (
                <div className="flex flex-col gap-6 items-center">
                    {results.length === 0 ? (
                        <div className="text-gray-500 mt-6">Ничего не найдено.</div>
                    ) : (
                        <>
                            {Array.isArray(firstBlock) && firstBlock.map(item => (
                                item.type === 'playlist'
                                    ? <PlaylistSearchCard key={`pl-${item.id}`} playlist={item} />
                                    : <SearchCard key={`v-${item.id}`} video={item} />
                            ))}

                            {shorts.length > 0 && (
                                // (grid-column) - позволяет элементу занимать несколько колонок
                                // (grid-column: 1 / -1) - растягивает элемент на всю ширину контейнера (от 1 до последней линии)
                                <div className="col-span-full">
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {shorts.map(short => (
                                            <ShortCard
                                                key={`short-${short.id}`}
                                                id={short.id}
                                                title={short.title}
                                                coverUrl={short.preview480}
                                                videoUrl={short.path}
                                                views={short.views ?? 0}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {Array.isArray(restblock) && restblock.map(item => (
                                item.type === 'playlist'
                                    ? <PlaylistSearchCard key={`pl-${item.id}`} playlist={item} />
                                    : <SearchCard key={`v-${item.id}`} video={item} />
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}