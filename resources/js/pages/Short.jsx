import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { api } from "../services/api"
import CommentPanel from "../components/short/CommentPanel"
import { getFingerprint } from "../services/fingerprint"

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
}) {
    const isActive = index === activeIndex
    const [likesCount, setLikesCount] = useState(0)
    const [dislikesCount, setDislikesCount] = useState(0)

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

                                <button className="px-3.5 py-1.5 rounded-full bg-white text-black text-sm font-semibold cursor-pointer leading-snug">
                                    Подписаться
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
                        <IconButton label="Like" onClick={() => {rateHandler('like')}} icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
                                <path d="M7 10v12"/>
                            </svg>} number={likesCount} />
                        <IconButton label="Dislike" onClick={() => {rateHandler('dislike')}} icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>
                                <path d="M17 14V2"/>
                            </svg>} number={dislikesCount} />
                        <IconButton label="Comment" onClick={() => onOpenComments?.(item.id)} icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>
                                <path d="M12 11h.01"/>
                                <path d="M16 11h.01"/>
                                <path d="M8 11h.01"/>
                            </svg>} />
                        <IconButton label="Share" onClick={() => {}} icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                                <path d="m21 3-9 9" />
                                <path d="M15 3h6v6" />
                            </svg>} />
                        <IconButton label="Prev" onClick={goPrev} icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 6L12 2L16 6"/>
                                <path d="M12 2V22"/>
                            </svg>} />
                        <IconButton label="Next" onClick={goNext} icon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 18L12 22L16 18"/>
                                <path d="M12 2V22"/>
                            </svg>} />
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

    const listSource = searchParams.get('list') || 'home'    

    const [items, setItems] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const containerRef = useRef(null)
    const videosRef = useRef([])
    const wheelLockRef = useRef(0)

    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [commentsVideoId, setCommentsVideoId] = useState(null)

    const openComments = useCallback((videoId) => {
        setCommentsVideoId(videoId)
        setIsCommentsOpen(true)
    }, [])
    const closeComments = useCallback(() => setIsCommentsOpen(false), [])

    // Загрузка шортсов
    useEffect(() => {
        (async () => {
            try {
                const url = listSource.startsWith('channel:')
                    ? `/api/v1/channel/${listSource.split(':')[1]}/shorts`
                    : `/api/v1/videos/shorts`

                const { data } = await api.get(url, { params: { limit: 50 } })

                setItems(data.data || data || [])
            } catch (error) {
                console.error("Не удалось загрузить шортсы", error);
            }
        })()
    }, [listSource])

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

    // Навигация
    const canPrev = activeIndex > 0
    const canNext = activeIndex < items.length - 1

    const goNext = useCallback(() => setActiveIndex((i) => Math.min(i + 1, items.length - 1)), [items.length])
    const goPrev = useCallback(() => setActiveIndex((i) => Math.max(i - 1, 0)), [])

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