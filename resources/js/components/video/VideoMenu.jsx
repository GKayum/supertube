import { useEffect, useRef, useState } from "react"

import { api } from "../../services/api"

function DotsIcon({ className = "" }) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
    )
}

export default function VideoMenu({ videoId, setToast, inWatchLater = false, setVideos = () => {} }) {
    const [open, setOpen] = useState(false)
    const menuRef = useRef()
    const btnRef = useRef()

    useEffect(() => {
        if (!open) return
        document.addEventListener('mousedown', handleClick)
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
        }
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    const handleMenuClick = async (action) => {
        setOpen(false)
        try {
            if (action === 'watchLater') {
                await api.get('/sanctum/csrf-cookie')
                const response = await api.post(`/api/v1/videos/${videoId}/watch-later`)

                setToast({visible: true, message: response.data.message, type: 'info'})
            }

            if (action === 'removeWatchLater') {
                await api.get('/sanctum/csrf-cookie')
                const response = await api.delete(`/api/v1/videos/${videoId}/watch-later`)

                setVideos(videos => videos.filter(video => video.id !== videoId))
                setToast({ visible: true, message: response.data.message, type: 'info' })
            }
        } catch (error) {
            let msg = error.response?.status === 401 ? 'Авторизуйтесь или зарегистрируйтесь!' : error.toString()
            setToast({visible: true, message: msg, type: 'error'})
        }
    }

    const actions = [
        inWatchLater
            ? { key: 'removeWatchLater', label: 'Удалить из списка' }
            : { key: 'watchLater', label: 'Смотреть позже'},
        { key: 'notInterested', label: 'Не интересует'},
        { key: 'complain', label: 'Пожаловаться'},
    ]

    return (
        <div className="relative" ref={menuRef}>
            <button
                ref={btnRef}
                className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Меню видео"
                onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
            >
                <DotsIcon className="w-6 h-6 text-gray-700 cursor-pointer" />
            </button>
            {open && (
                <div className="absolute right-0 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-100 animate-fadeIn">
                    {actions.map(item => (
                        <button
                            key={item.key}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 text-sm transition cursor-pointer"
                            onClick={() => handleMenuClick(item.key) }
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}