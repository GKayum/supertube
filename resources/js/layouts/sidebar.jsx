import IconMain from "../icons/main"
import IconHistory from "../icons/history"
import IconLiked from "../icons/liked"
import IconSubs from "../icons/subscriptions"
import IconWatchLater from "../icons/watchLater"
import { Link, useLocation } from "react-router-dom"

export default function Sidebar({ open, onClose }) {
    const location = useLocation()

    const menu = [
        {to: "/", label: "Главная", icon: <IconMain />},
        {to: "/history", label: "История", icon: <IconHistory />},
        {to: "/subscriptions", label: "Подписки", icon: <IconSubs />},
        {to: "/watch-later", label: "Смотреть позже", icon: <IconWatchLater />},
        {to: "/liked", label: "Понравившиеся", icon: <IconLiked />},
    ]

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-200 ${open ? 'opacity-30 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <nav
                className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <span className="font-bold text-xl text-gray-800">
                        Меню
                    </span>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={onClose}
                        aria-label="Закрыть меню"
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                            <line x1="5" y1="5" x2="15" y2="15" stroke="#555" strokeWidth="2" />
                            <line x1="15" y1="5" x2="5" y2="15" stroke="#555" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                <ul className="mt-2 space-y-1">
                    {menu.map(item => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className={`flex items-center px-5 py-3 text-base hover:bg-gray-100 rounded-r-full transition ${location.pathname === item.to ? 'bg-gray-100 font-semibold' : ''}`}
                                onClick={onClose}
                            >
                                <span className="mr-4">{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}