import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api, handlerApiError } from "../../services/api";
import { useEffect, useMemo, useState } from "react";

const STATUSES = {
    public: 'Публичный',
    unlisted: 'По ссылке',
    private: 'Приватный',
}

export default function Playlist() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('private')

    const [allVideos, setAllVideos] = useState([])
    const [loadingVideos, setLoadingVideos] = useState(true)
    const [filter, setFilter] = useState('')

    const [orderedIds, setOrderedIds] = useState([])
    const selectedSet = useMemo(() => new Set(orderedIds), [orderedIds])

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [ok, setOk] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/api/v1/user/videos')
                setAllVideos(Array.isArray(data) ? data : data.data ?? [])
            } catch (error) {
                handlerApiError(error, { setValidationErrors: () => {}, setError })
            } finally {
                setLoadingVideos(false)
            }
        })()
    }, [])

    const filtered = useMemo(() => {
        const q = filter.trim().toLocaleLowerCase()

        if (!q) return allVideos

        return allVideos.filter(v => v.title?.toLocaleLowerCase().includes(q))
    }, [allVideos, filter])

    const togglePick = (id) => {
        if (selectedSet.has(id)) {
            setOrderedIds(prev => prev.filter(x => x !== id))
        } else {
            setOrderedIds(prev => [...prev, id])
        }
    }

    const onDragEnd = (result) => {
        if (!result.destination) return

        const from = result.source.index
        const to = result.destination.index

        if (from === to) return

        setOrderedIds(prev => {
            const arr = [...prev]
            const [moved] = arr.splice(from, 1)
            arr.splice(to, 0, moved)

            return arr
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        setOk('')

        try {
            const videos = orderedIds.map((id, idx) => ({ id, position: idx }))
            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/playlists/store', {
                title,
                description,
                status,
                videos,
            })

            setOk(response.data.message)
            setTitle('')
            setDescription('')
            setStatus('private')
            setOrderedIds([])
        } catch (error) {
            handlerApiError(error, { setValidationErrors: () => {}, setError })
        } finally {
            setSubmitting(false)
        }
    }

    const inputBase = 'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500'
    const card = 'bg-white rounded-2xl shadow-md'

    return (
        <main className="max-w-5xl mx-auto p-6 mt-10">
            <div className={`${card} p-6`}>
                <h1 className="text-2xl font-bold mb-4">Создать плейлист</h1>

                {error && (
                    <div className="mb-4 p-2 text-center rounded-lg bg-red-100 text-red-600">
                        {error}
                    </div>
                )}
                {ok && (
                    <div className="mb-4 p-2 text-center rounded-lg bg-green-100 text-green-700">
                        {ok}
                    </div>
                )}

                <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
                    <section className={`${card} p-4`}>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Название *</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className={inputBase}
                                placeholder="Например, 'Избранное'"
                                required
                                maxLength={120}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Описание</label>
                            <textarea 
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className={`${inputBase} h-32 resize-y`}
                                maxLength={2000}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Статус *</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className={inputBase}
                            >
                                {Object.entries(STATUSES).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={!title.trim() || submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            {submitting ? 'Создаем...' : 'Создать плейлист'}
                        </button>
                    </section>

                    <section className="space-y-4">
                        <div className={`${card} p-4`}>
                            <h2 className="text-lg font-semibold mb-3">Видео автора</h2>
                            <div className="flex items-center gap-2 mb-3">
                                <input 
                                    type="text"
                                    value={filter}
                                    onChange={e => setFilter(e.target.value)}
                                    placeholder="Фильтр по названию..."
                                    className={inputBase}
                                />
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    Выбрано: {orderedIds.length}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`${card} border border-gray-100`}>
                                    <div className="px-3 py-2 text-sm bg-gray-50 border-b rounded-t-2xl">
                                        Все видео
                                    </div>
                                    <div className="max-h-[440px] overflow-auto divide-y">
                                        {loadingVideos ? (
                                            <div className="p-3 text-sm text-gray-500">Загрузка...</div>
                                        ) : filtered.length === 0 ? (
                                            <div className="p-3 text-sm text-gray-500">Ничего не найдено</div>
                                        ) : (
                                            filtered.map(v => (
                                                <label key={v.id} className="flex items-center gap-2 p-3 cursor-pointer">
                                                    <input 
                                                        type="checkbox"
                                                        checked={selectedSet.has(v.id)}
                                                        onChange={() => togglePick(v.id)}
                                                    />
                                                    <span className="text-sm truncate">{v.title}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className={`${card} border border-gray-100`}>
                                    <div className="px-3 py-2 text-sm bg-gray-50 border-b rounded-t-2xl">
                                        В плейлисте
                                    </div>

                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="playlist-videos">
                                            {(provided) => (
                                                <ul
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className="max-h-[440px] overflow-auto divide-y"
                                                >
                                                    {orderedIds.length === 0 && (
                                                        <li className="p-3 text-sm text-gray-500">
                                                            Выбери видео слева, чтобы добавить в плейлист
                                                        </li>
                                                    )}

                                                    {orderedIds.map((id, index) => {
                                                        const v = allVideos.find(x => x.id === id)

                                                        if (!v) return null

                                                        return (
                                                            <Draggable key={String(id)} draggableId={String(id)} index={index}>
                                                                {(drag) => (
                                                                    <li
                                                                        ref={drag.innerRef}
                                                                        {...drag.draggableProps}
                                                                        {...drag.dragHandleProps}
                                                                        className="flex items-center gap-3 p-3 bg-white"
                                                                    >
                                                                        <svg className="w-4 h-4 text-gray-400 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                            <circle cx="9" cy="12" r="1"/>
                                                                            <circle cx="9" cy="5" r="1"/>
                                                                            <circle cx="9" cy="19" r="1"/>
                                                                            <circle cx="15" cy="12" r="1"/>
                                                                            <circle cx="15" cy="5" r="1"/>
                                                                            <circle cx="15" cy="19" r="1"/>
                                                                        </svg>
                                                                        <span className="text-sm truncate flex-1">{v.title}</span>
                                                                        <button
                                                                            type="button"
                                                                            className="text-xs text-blue-600 hover:underline"
                                                                            onClick={() => togglePick(id)}
                                                                            title="Удалить из плейлиста"
                                                                        >
                                                                            Удалить
                                                                        </button>
                                                                    </li>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    })}
                                                    {provided.placeholder}
                                                </ul>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </main>
    )
}