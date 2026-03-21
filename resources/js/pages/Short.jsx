import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { api } from "../services/api"


const SWIPE_THRESHOLD = 60
const WHEEL_THROTTLE_MS = 600

function ShortCard({
    item,
    index,
    activeIndex,
    setVideoRef,
    goNext,
    goPrev,
}) {
    const isActive = index === activeIndex

    return (
        <section className="h-screen w-screen relative flex items-center justify-center">
            <div className="relative h-full w-full flex items-center justify-center">
                <video 
                    ref={setVideoRef}
                    playsInline
                    muted
                    loop
                    poster={item.poster}
                    src={item.path}
                    className="max-h-[100vh] max-w-[calc(100vh*(9/16))] aspect-9/16 rounded-2xl shadow-xl object-cover"
                />

                <div className="absolute right-2 md:right-6 bottom-24 md:bottom-28 flex flex-col gap-4 items-center">
                    <IconButton label="Like" onClick={() => {}} icon="❤️" />
                    <IconButton label="Comment" onClick={() => {}} icon="💬" />
                    <IconButton label="Share" onClick={() => {}} icon="🔄️" />
                    <IconButton label="Prev" onClick={goPrev} icon="↑" />
                    <IconButton label="Next" onClick={goNext} icon="↓" />
                </div>

                <div className="absolute left-2 right-2 md:left-6 md:right-6 bottom-4 text-white">
                    <div className="flex items-center gap-3 mb-2 cursor-pointer">
                        {item.user?.avatar ? (
                            <img src={item.user.avatar} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">🎬</div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{item.user?.name || 'Автор'}</div>
                            <div className="text-sm text-white/70 truncate">{item.title}</div>
                        </div>
                        <button className="px-3 py-1 rounded-full bg-white text-black text-sm font-semibold cursor-pointer">Подписаться</button>
                    </div>

                    {item.description && (
                        <div className="text-sm text-white/80 line-clamp-2">{item.description}</div>
                    )}
                </div>
            </div>
        </section>
    )
}

function IconButton({label, icon, onClick}) {
    return (
        <button
            onClick={onClick}
            className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/40 text-white text-xl flex items-center justify-center"
            aria-label={label}
        >
            <span>{icon}</span>
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

    // Загрузка шортсов
    useEffect(() => {
        (async () => {
            try {
                const url = listSource.startsWith('channel:')
                    ? `/api/v1/channel/${listSource.split(':')[1]}/shorts`
                    : `/api/v1/videos/shorts`

                const { data } = await api.get(url, { params: { limit: 50 } })
                console.log('shorts items:', data);
                

                setItems(data.data || data || {})
            } catch (error) {
                console.error("Не удалось загрузить шортсы", error);
            }
        })()
    }, [listSource])

    useEffect(() => {
        if (!items.length) return

        const byId = items.findIndex((item) => String(item.id) === String(id))
        console.log('byId:', byId);
        
        setActiveIndex(byId >= 0 ? byId : 0)
    }, [items, id])

    useEffect(() => {
        if (!items.length) return

        const item = items[activeIndex]

        if (!item) return
        navigate(`/shorts/${item.id}?list=${listSource}`, { replace: true })
    }, [activeIndex, items, navigate, listSource])

    useEffect(() => {
        const now = Date.now()
        console.log(`now: ${now} | whellLockRef: ${wheelLockRef.current}`);

        if (now - wheelLockRef.current < 150) return

        videosRef.current.forEach((v, i) => {
            if (!v) return

            if (i === activeIndex) {
                v.muted = true
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

    // Обработка прокрутки колесика мыши
    useEffect(() => {
        const el = containerRef.current

        if (!el) return

        const onWheel = (e) => {
            const now = Date.now()

            // wheelLockRef - хранит время последнего срабатывания обработчика
            // Ограничение частоты вызовов, между срабатываниями должно пройти > 600мс
            if (now - wheelLockRef.current < WHEEL_THROTTLE_MS) return

            // Величина прокрутки по вертикали (deltaY)
            if (Math.abs(e.deltaY) < 8) return

            wheelLockRef.current = now

            if (e.deltaY > 0) goNext(); else goPrev()
        }

        // Отключение preventDefault() → { passive: true }
        el.addEventListener('wheel', onWheel, { passive: true })

        return () => el.removeEventListener('wheel', onWheel)
    }, [goNext, goPrev])

    // Тач-свайп
    const touchStartY = useRef(null)
    const touchMoveY = useRef(null)

    const onTouchStartY = (e) => {
        touchStartY.current = e.touches[0].clientY
        touchMoveY.current = null
    }

    const onTouchMove = (e) => {
        touchMoveY.current = e.touches[0].clientY
    }

    const onTouchEnd = () => {
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
            <div className="h-screen w-screen flex items-center justify-center text-muted-foreground">
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
                    />
                ))}
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
                <button
                    aria-label="Предыдущее"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="pointer-events-none hidden md:block text-white/80 hover:text-white disabled:opacity-30 cursor-pointer"
                >↑</button>
                <button
                    aria-label="Следующее"
                    onClick={goNext}
                    disabled={!canNext}
                    className="pointer-events-none hidden md:block text-white/80 hover:text-white disabled:opacity-30 cursor-pointer"
                >↓</button>
            </div>
        </div>
    )
}