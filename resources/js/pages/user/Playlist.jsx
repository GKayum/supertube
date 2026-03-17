import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { api, handlerApiError } from "../../services/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const STATUSES = {
    public: 'Публичный',
    unlisted: 'По ссылке',
    private: 'Приватный',
}

export default function Playlist() {
    const { playlistId } = useParams()
    const navigate = useNavigate()

    const isEdit = Boolean(playlistId)

    // Форма
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('private')

    // Список всех видео и фильтрация
    const [allVideos, setAllVideos] = useState([])
    const [loadingVideos, setLoadingVideos] = useState(true)
    const [filter, setFilter] = useState('')

    // Выбранные видео и их порядок
    const [orderedIds, setOrderedIds] = useState([])
    const selectedSet = useMemo(() => new Set(orderedIds), [orderedIds])

    // Плейлист (редактирование)
    const [loadingPlaylist, setLoadingPlaylist] = useState(isEdit)
    const [playlistLoadingError, setPlaylistLoadingError] = useState('')

    // Отправка
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [ok, setOk] = useState('')

    const validationRef = useRef({})

    // Загрузка видео автора
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/api/v1/user/videos')
                setAllVideos(Array.isArray(data) ? data : data.data ?? [])
            } catch (error) {
                handlerApiError(error, { setValidationErrors: v => (validationRef.current = v), setError })
            } finally {
                setLoadingVideos(false)
            }
        })()
    }, [])

    // Получение списка видео из плейлиста, если страница редактирование
    useEffect(() => {
        if (!isEdit) return

        (async () => {
            setLoadingPlaylist(true)
            setPlaylistLoadingError('')

            try {
                const { data } = await api.get(`/api/v1/playlist/${playlistId}`)
                // data = { id, title, description, status, videos: [{id, position, title, ...}, ...] }
                setTitle(data.data.title ?? '')
                setDescription(data.data.description ?? '')
                setStatus(data.data.status ?? 'private')
                
                // Сортировка по 'position'
                const sorted = [...(data.data.videos ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                setOrderedIds(sorted.map(v => v.id))
            } catch (error) {
                setPlaylistLoadingError('Не удалось загрузить плейлист')
                handlerApiError(error, { setValidationErrors: v => (validationRef.current = v), setError })
            } finally {
                setLoadingPlaylist(false)
            }
        })()
    }, [isEdit, playlistId])

    // Фильтрация видео по названию
    const filtered = useMemo(() => {
        const q = filter.trim().toLocaleLowerCase()

        if (!q) return allVideos

        return allVideos.filter(v => v.title?.toLowerCase().includes(q))
    }, [allVideos, filter])

    // выбор/снятие видео
    const togglePick = (id) => {
        setOrderedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id)
            }

            return [...prev, id]
        })
    }

    const selectAll = () => {
        const ids = filtered.map(v => v.id)
        // Добавление тех видео, которых еще нет, в конец списка
        setOrderedIds(prev => {
            const set = new Set(prev)
            const merged = [...prev]

            ids.forEach(id => { if (!set.has(id)) merged.push(id) })

            return merged
        })
    }

    const clearSelected = () => {
        setOrderedIds([])
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

    // Общий payload
    const buildPayload = () => ({
        title,
        description,
        status,
        videos: orderedIds.map((id, idx) => ({ id, position: idx }))
    })

    const onSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        setOk('')
        validationRef.current = ''

        try {
            await api.get('/sanctum/csrf-cookie')

            if (!isEdit) {
                const response = await api.post('/api/v1/playlists/store', buildPayload())
                setOk(response.data.message ?? 'Плейлист создан!')
                setTitle('')
                setDescription('')
                setStatus('private')
                setOrderedIds([])
            } else {
                await api.put(`/api/v1/playlist/${playlistId}/update`, buildPayload())
                
                setOk('Плейлист обновлен!')
            }
        } catch (error) {
            handlerApiError(error, { setValidationErrors: v => (validationRef.current = v), setError })
        } finally {
            setSubmitting(false)
        }
    }

    const inputBase = 'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500'
    const card = 'bg-white rounded-2xl shadow-md'

    const loading = loadingVideos || loadingPlaylist

    return (
        <main className="max-w-5xl mx-auto p-6 mt-10">
            <div className={`${card} p-6`}>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">
                        {isEdit ? 'Редактировать плейлист' : 'Создать плейлист'}
                    </h1>
                    {isEdit && (
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                            ← Назад
                        </button>
                    )}
                </div>

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
                {playlistLoadingError && (
                    <div className="mb-4 p-2 text-center rounded-lg bg-yellow-100 text-yellow-700">
                        {playlistLoadingError}
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
                                placeholder="Например, «Избранное»"
                                required
                                maxLength={120}
                                disabled={loading || submitting}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Описание</label>
                            <textarea 
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className={`${inputBase} h-32 resize-y`}
                                placeholder="Описание плейлиста"
                                maxLength={2000}
                                disabled={loading || submitting}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-gray-700">Статус *</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className={inputBase}
                                disabled={loading || submitting}
                            >
                                {Object.entries(STATUSES).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={!title.trim() || submitting || loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            {submitting
                                ? (isEdit ? 'Сохраняем...' : 'Создаем...')
                                : (isEdit ? 'Сохранить изменения' : 'Создать плейлист')}
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
                                    disabled={loading}
                                />
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    Выбрано: {orderedIds.length}
                                </span>

                                <div className="ml-auto flex gap-2">
                                    <button
                                        type="button"
                                        onClick={selectAll}
                                        disabled={loading}
                                        className="text-xs px-2 py-1 rounded bg-gray-400 hover:bg-gray-100 cursor-pointer"
                                    >
                                        Выбрать всё
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearSelected}
                                        disabled={loading}
                                        className="text-xs px-2 py-1 rounded bg-gray-400 hover:bg-gray-100 cursor-pointer"
                                    >
                                        Очистить
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Все видео (чекбоксы) */}
                                <div className={`${card} border border-gray-100`}>
                                    <div className="px-3 py-2 text-sm bg-gray-50 border-b rounded-t-2xl">
                                        Все видео
                                    </div>
                                    <div className="max-h-[440px] overflow-auto divide-y [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-400">
                                        {loading ? (
                                            <div className="p-3 text-sm text-gray-500">Загрузка...</div>
                                        ) : filtered.length === 0 ? (
                                            <div className="p-3 text-sm text-gray-500">Ничего не найдено</div>
                                        ) : (
                                            filtered.map(v => (
                                                <label key={v.id} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50">
                                                    <input 
                                                        type="checkbox"
                                                        checked={selectedSet.has(v.id)}
                                                        onChange={() => togglePick(v.id)}
                                                        disabled={submitting}
                                                    />
                                                    <span className="text-sm truncate">{v.title}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>
                                
                                {/* Выбранные видео */}
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
                                                    className="max-h-[440px] overflow-auto divide-y [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-400"
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
                                                                        className="flex items-center gap-3 p-3 bg-white active:bg-gray-50"
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
                                                                            disabled={submitting}
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