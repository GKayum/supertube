import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
            <h1 className="mt-8 text-4xl font-extrabold text-gray-800 tracking-tight">
                Видео недоступно
            </h1>
            <p className="mt-3 text-lg text-gray-600 text-center max-w-md">
                Эта страница недоступна. <br />
                Возможно, вы ошиблись адресом или видео было удалено.
            </p>
            <Link
                to="/"
                className="mt-8 px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
            >
                На главную SuperTube
            </Link>
        </main>
    )
}