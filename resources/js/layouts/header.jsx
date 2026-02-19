import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../components/user/Avatar";

export default function Header({ onSideBarClick }) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [value, setValue] = useState('')
    const { user, userLoading, logout } = useAuth()
    const navigate = useNavigate()

    const onSearchSubmit = (e) => {
        e.preventDefault()
        if (value.length < 2) return
        navigate(`/search?q=${encodeURIComponent(value)}`)
    }

    return (
        <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
            <div className="flex items-center justify-between h-16 px-4">

                <div className="flex items-center space-x-3">
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                        onClick={onSideBarClick}
                        aria-label="Меню"
                    >
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <rect x="4" y="6" width="16" height="2" rx="1" fill="#555" />
                            <rect x="4" y="11" width="16" height="2" rx="1" fill="#555" />
                            <rect x="4" y="16" width="16" height="2" rx="1" fill="#555" />
                        </svg>
                    </button>
                    
                    <Link to="/" className="flex items-center space-x-1">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path fill="#FF0000" d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                            <text x="50%" y="50%" 
                                    fontSize="24"
                                    fontWeight="900"
                                    textAnchor="middle" 
                                    dominantBaseline="central" 
                                    fill="#FFF">
                                S
                            </text>
                        </svg>
                        <span className="font-bold text-xl text-gray-800 tracking-tight">
                            SuperTube
                        </span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center px-8">
                    <form onSubmit={onSearchSubmit} className="flex w-full max-w-lg">
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="w-full border border-gray-300 rounded-l-full px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 text-sm"
                            placeholder="Введите запрос"
                            type="search" 
                        />
                        <button type="submit" className="bg-gray-100 border-l-0 border-gray-300 rounded-r-full px-4 py-1 hover:bg-gray-200 flex items-center">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="7" stroke="#222" strokeWidth="2" />
                                <line x1="16" y1="16" x2="21" y2="21" stroke="#222" strokeWidth="2" />
                            </svg>
                        </button>
                    </form>
                </div>

                <div className="flex items-center space-x-4">
                    {userLoading ? (
                        <span className="text-gray-500">Загрузка...</span>
                    ) : (
                        !user ? (
                            <>
                                <Link 
                                    to='/login' 
                                    className="py-1 px-4 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 font-medium"
                                >
                                    Войти
                                </Link>
                                <Link 
                                    to='/register' 
                                    className="py-1 px-4 border border-gray-300 text-gray-700 rounded-full hover:bg-blue-100 font-medium"
                                >
                                    Регистрация
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(prev => !prev)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                    >
                                        <Avatar user={user} />
                                        <span className="text-gray-800 font-medium">
                                            {user.name}
                                        </span>
                                    </button>

                                    {dropdownOpen && (
                                        <div 
                                            className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-20"
                                            onMouseLeave={() => setDropdownOpen(false)}
                                        >
                                            <Link
                                                to='/my-videos'
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Мои видео
                                            </Link>
                                            <Link 
                                                to='/upload' 
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Загрузить
                                            </Link>
                                            <Link
                                                to='/settings'
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Аккаунт
                                            </Link>
                                            <Link
                                                to='/channel/settings'
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Канал
                                            </Link>
                                            <button
                                                onClick={logout} 
                                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                            >
                                                Выйти
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )
                    )}
                </div>

            </div>
        </header>
    )
}