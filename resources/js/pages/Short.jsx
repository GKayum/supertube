import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { api } from "../services/api"
import CommentPanel from "../components/short/CommentPanel"
import { getFingerprint } from "../services/fingerprint"
import Toast from "../components/form/Toast"

const SWIPE_THRESHOLD = 60
const WHEEL_THROTTLE_MS = 600

function ShortCard({
    item,
    index,
    activeIndex,
    setVideoRef,
    goNext,
    goPrev,
    onOpenComments,
    setToast
}) {
    const isActive = index === activeIndex
    const [likesCount, setLikesCount] = useState(0)
    const [dislikesCount, setDislikesCount] = useState(0)
    const [subLoading, setSubLoading] = useState(false)

    const deriveSubInfo = (item) => {
        const isSub = Boolean(item.channel?.isSubscribed ?? false)
        const subs = Number(item.channel?.subscribers ?? 0)
        const channelId = item.channel?.id ?? item.user?.id
        return { isSub, subs, channelId }
    }
    const initial = deriveSubInfo(item)
    const [isSubscribed, setIsSubscribed] = useState(initial.isSub)
    const [subscribers, setSubscribers] = useState(initial.subs)
    const [channelId, setChannelId] = useState(initial.channelId)

    const rateHandler = async (type) => {
        try {
            const fingerprint = await getFingerprint()

            await api.get('/sanctum/csrf-cookie')
            const response = await api.post('/api/v1/videos/' + item.id + '/' + type, { fingerprint })

            setLikesCount(response.data.likes)
            setDislikesCount(response.data.dislikes)
        } catch (error) {
            setToast({ visible: true, message: error.response?.data?.message || error, type: 'error' })
        }
    }

    // Синхронизация состояния подписки при смене карточки/канала
    useEffect(() => {
        const info = deriveSubInfo(item)
        setIsSubscribed(info.isSub)
        setSubscribers(info.subs)
        setChannelId(info.channelId)
    }, [item.id, item.channel?.id, item.user?.id])

    // 
    const processSubs = async (type, nextIsSubscribed) => {
        setSubLoading(true)
        try {
            const channelId = item.channel?.id ?? item.user?.id // получение id канала, иначе id автора
            const response = await api.post(`/api/v1/channel/${channelId}/${type}`)
            setIsSubscribed(nextIsSubscribed)
            setSubscribers(
                Number(response.data.subscribers ?? response.data.subscribers_count ?? subscribers)
            )
        } catch (error) {
            setToast({ visible: true, message: error.response?.data?.message || error, type: 'error' })
        } finally {
            setSubLoading(false)
        }
    }

    // Получение likes/dislikes при изменении ID video
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await api.get('/api/v1/videos/' + item.id + '/likes')

                setLikesCount(response.data.likes)
                setDislikesCount(response.data.dislikes)
            } catch (error) {
                console.log(error)
            }
        }

        fetchLikes()
    }, [item.id])

    return (
        <section className="h-dvh w-dvw relative flex items-center justify-center">
            <div className="relative h-full w-full flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="relative inline-block">
                        <video 
                            ref={setVideoRef}
                            playsInline
                            autoPlay={isActive}
                            loop
                            poster={item.preview480}
                            src={item.path}
                            className="h-dvh w-auto max-h-none aspect-9/16 rounded-2xl shadow-xl object-cover"
                        />

                        <div className="absolute left-2 right-2 md:left-4 md:right-4 bottom-2 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3 cursor-pointer min-w-0">
                                    {item.user?.avatar ? (
                                        <img 
                                            src={item.user.avatar}
                                            alt="avatar"
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                            🎬
                                        </div>
                                    )}
                                    <div className="font-semibold truncate">
                                        {item.user?.name || 'Автор'}
                                    </div>
                                </div>

                                <button 
                                    className="px-3.5 py-1.5 rounded-full bg-white text-black text-sm font-semibold cursor-pointer leading-snug"
                                    disabled={subLoading}
                                    onClick={() =>
                                        isSubscribed ? processSubs('unsubscribe', false) : processSubs('subscribe', true)
                                    }
                                >
                                    {isSubscribed ? 'Отписаться' : 'Подписаться'}
                                    {Number.isFinite(subscribers) && <span className="ml-2 text-black/70">({subscribers})</span>}
                                </button>
                            </div>

                            <div className="text-sm text-white/90 font-medium mb-1 line-clamp-1">
                                {item.title}
                            </div>

                            {item.description && (
                                <div className="text-sm text-white/70 line-clamp-1">
                                    {item.description}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <IconButton label="Like" onClick={() => {rateHandler('like')}} icon={<img src="/icons/shorts/like-white.svg"/>} number={likesCount} />
                        <IconButton label="Dislike" onClick={() => {rateHandler('dislike')}} icon={<img src="/icons/shorts/dislike-white.svg"/>} number={dislikesCount} />
                        <IconButton label="Comment" onClick={() => onOpenComments?.(item.id)} icon={<img src="/icons/shorts/comment-white.svg"/>} />
                        <IconButton label="Share" onClick={() => {}} icon={<img src="/icons/shorts/share-white.svg"/>} />
                        <IconButton label="Prev" onClick={goPrev} icon={<img src="/icons/shorts/arrowUp-white.svg"/>} />
                        <IconButton label="Next" onClick={goNext} icon={<img src="/icons/shorts/arrowDown-white.svg"/>} />
                    </div>
                </div>
            </div>
        </section>
    )
}

function IconButton({ label, icon, onClick, number = '' }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center text-white cursor-pointer"
            aria-label={label}
        >
            <div className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/40 flex items-center justify-center backdrop-blur-2xl">
                {icon}
            </div>
            {number !== '' && (
                <span className="text-sm text-gray-200">{number}</span>
            )}
        </button>
    )
}

export default function Short() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    const listSource = searchParams.get('list') || 'home'    

    const [items, setItems] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const containerRef = useRef(null)
    const videosRef = useRef([])
    const wheelLockRef = useRef(0)

    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [commentsVideoId, setCommentsVideoId] = useState(null)

    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [seen, setSeen] = useState(new Set()) // Набор уже загруженных id
    const allowMoreRef = useRef(false) // включение догрузки после первого листания

    const openComments = useCallback((videoId) => {
        setCommentsVideoId(videoId)
        setIsCommentsOpen(true)
    }, [])
    const closeComments = useCallback(() => setIsCommentsOpen(false), [])

    // Сброс ленты при смене источника (listSource) (канал/домой) - спровоцирует новую первичную загрузку
    useEffect(() => {
        setItems([])
        setActiveIndex(0)
        setHasMore(true)
        setSeen(new Set())
    }, [listSource])

    // 1) Первичная загрузка: выбранный шортс первым + 5 случайных
    // Выполнение функции ТОЛЬКО когда список (items) пустой, иначе каждый navigate меняющим id перезапускает фетч
    useEffect(() => {
        if (items.length) return // защита от перезагрузки на каждый navigate
        const firstId = Number(id)
        
        if (!Number.isFinite(firstId)) return // проверяет, является ли конечным числом (любое число, кроме бесконечности и NaN)

        allowMoreRef.current = false // до первого взаимодействия - не догружаем
        const channelId = listSource.startsWith('channel:') ? listSource.split(':')[1] : null

        api.get('/api/v1/shorts/viewer', {
            params: { firstId, channelId, limit: 5 },
        }).then(({ data }) => {
            const list = data?.data ?? data ?? []
            setItems(list)
            setActiveIndex(0)
            setSeen(new Set(list.map(video => Number(video.id))))
            setHasMore(true)
        }).catch((error) => console.error('Не удалось загрузить стартовые шортсы:', error))
    }, [id, listSource, items.length])

    // 2) Дозагрузка: когда пользователь дошел до последнего элемента
    useEffect(() => {
        if (!items.length) return
        if (loadingMore) return
        if (!hasMore) return // проверка, есть ли еще видео для подгрузки
        if (!allowMoreRef.current) return // проверка, если не было листания

        const onLast = activeIndex >= items.length - 1
        if (!onLast) return

        setLoadingMore(true)

        const params = new URLSearchParams()
        Array.from(seen).forEach((val) => params.append('exclude[]', Number(val)))
        const channelId = listSource.startsWith('channel:') ? listSource.split(':')[1] : null
        if (channelId != null) params.append('channelId', channelId)
        params.append('limit', '5')

        api.get('/api/v1/shorts/viewer/more', { params }).then(({ data }) => {
            const incoming = data?.data ?? data ?? []
            // Если пришел пустой массив incoming → шортсы кончились, больше не запрашивает
            if (!incoming.length) {
                setHasMore(false)
                return
            }

            setItems((prev) => {
                const have = new Set(prev.map(i => Number(i.id)))
                const fresh = incoming.filter(i => !have.has(Number(i.id)))
                if (!fresh.length) return prev
                setSeen((prevSeen) => {
                    const next = new Set(prevSeen)
                    fresh.forEach(i => next.add(Number(i.id)))
                    return next
                })

                return [...prev, ...fresh]
            })
        }).finally(() => setLoadingMore(false))
    }, [activeIndex, items.length, loadingMore, listSource, seen])

    useEffect(() => {
        if (!items.length) return

        const byId = items.findIndex((item) => String(item.id) === String(id))
        
        setActiveIndex(byId >= 0 ? byId : 0)
    }, [items, id])

    useEffect(() => {
        if (!items.length) return

        const item = items[activeIndex]

        if (!item) return
        navigate(`/shorts/${item.id}?list=${listSource}`, { replace: true })
    }, [activeIndex, items, navigate, listSource])

    useEffect(() => {
        if (isCommentsOpen) setIsCommentsOpen(false)
    }, [activeIndex])

    useEffect(() => {
        const now = Date.now()

        if (now - wheelLockRef.current < 150) return

        videosRef.current.forEach((v, i) => {
            if (!v) return

            if (i === activeIndex) {
                v.loop = true

                const play = () => v.play().catch(() => {})

                if (v.readyState >= 2) play(); else v.onloadeddata = play
            } else {
                v.pause()
                v.currentTime = Math.min(v.currentTime, v.duration || 0)
            }
        })
    }, [activeIndex])

    useEffect(() => {
        if (!items.length) return
        if (activeIndex !== 0) return
        const v = videosRef.current[0]
        if (!v) return
        try {
            // Добавление атрибута muted - используется для отключения звука по умолчанию при воспроизведении видеофайла
            v.muted = true
            const play = () => v.play().catch(() => {})
            if (v.readyState >= 2) play();
            else v.onloadeddata = play
        } catch (error) {
            
        }
    }, [items.length, activeIndex])

    // Навигация
    const canPrev = activeIndex > 0
    const canNext = activeIndex < items.length - 1

    const goNext = useCallback(() => {
        allowMoreRef.current = true
        setActiveIndex((i) => Math.min(i + 1, items.length - 1))
    }, [items.length])
    const goPrev = useCallback(() => {
        allowMoreRef.current = true
        setActiveIndex((i) => Math.max(i - 1, 0))
    }, [])

    // Функция для обработки нажатия кнопок стрелочек ↑/↓
    useEffect(() => {
        const onKey = (e) => {
            if (isCommentsOpen) return

            if (e.key === "ArrowDown" || e.key === "j") {
                e.preventDefault()
                goNext()
            }
            
            if (e.key === "ArrowUp" || e.key === "k") {
                e.preventDefault()
                goPrev()
            }
        }
        window.addEventListener("keydown", onKey)
        
        return () => window.removeEventListener("keydown", onKey)
    }, [goNext, goPrev])

    // // Обработка прокрутки колесика мыши
    // useEffect(() => {
    //     const el = containerRef.current

    //     if (!el) return

    //     const onWheel = (e) => {
    //         if (isCommentsOpen) return

    //         const now = Date.now()

    //         // wheelLockRef - хранит время последнего срабатывания обработчика
    //         // Ограничение частоты вызовов, между срабатываниями должно пройти > 600мс
    //         if (now - wheelLockRef.current < WHEEL_THROTTLE_MS) return

    //         // Величина прокрутки по вертикали (deltaY)
    //         if (Math.abs(e.deltaY) < 8) return

    //         wheelLockRef.current = now

    //         if (e.deltaY > 0) goNext(); else goPrev()
    //     }

    //     // Отключение preventDefault() → { passive: true }
    //     el.addEventListener('wheel', onWheel, { passive: true })

    //     return () => el.removeEventListener('wheel', onWheel)
    // }, [goNext, goPrev])

    // Тач-свайп
    const touchStartY = useRef(null)
    const touchMoveY = useRef(null)

    const onTouchStartY = (e) => {
        if (isCommentsOpen) return
        touchStartY.current = e.touches[0].clientY
        touchMoveY.current = null
    }

    const onTouchMove = (e) => {
        if (isCommentsOpen) return
        touchMoveY.current = e.touches[0].clientY
    }

    const onTouchEnd = () => {
        if (isCommentsOpen) return
        if (touchStartY.current == null || touchMoveY.current == null) return

        const dy = touchMoveY.current - touchStartY.current

        if (Math.abs(dy) > SWIPE_THRESHOLD) {
            if (dy < 0) goNext(); else goPrev()
        }

        touchStartY.current = null
        touchMoveY.current = null
    }

    useEffect(() => {
        const preload = (i) => {
            const v = videosRef.current[i]

            if (v && v.preload !== 'auto') v.preload = 'auto'
        }

        preload(activeIndex + 1)
        preload(activeIndex - 1)
    }, [activeIndex])

    if (!items.length) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
                Загрузка шортсов...
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-black overflow-hidden touch-pan-y overscroll-none select-none h-dvh w-dvw"
            onTouchStart={onTouchStartY}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div 
                className="h-full w-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateY(-${activeIndex * 100}dvh)` }}
            >
                {items.map((item, i) => (
                    <ShortCard
                        key={item.id}
                        item={item}
                        index={i}
                        activeIndex={activeIndex}
                        setVideoRef={(el) => (videosRef.current[i] = el)}
                        goNext={goNext}
                        goPrev={goPrev}
                        onOpenComments={() => openComments(item.id)}
                        setToast={setToast}
                    />
                ))}
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
                <button
                    aria-label="Предыдущее"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="pointer-events-auto hidden md:block text-white/80 hover:text-white disabled:opacity-30 cursor-pointer"
                >↑</button>
                <button
                    aria-label="Следующее"
                    onClick={goNext}
                    disabled={!canNext}
                    className="pointer-events-auto hidden md:block text-white/80 hover:text-white disabled:opacity-30 cursor-pointer"
                >↓</button>
            </div>

            <CommentPanel
                videoId={commentsVideoId ?? (items[activeIndex]?.id ?? null)}
                isOpen={isCommentsOpen}
                onClose={closeComments}
            />
        </div>
    )
}