import { Link } from "react-router-dom";

export default function Avatar({ user, text = 'text-base', classes = '' }) {
    const avatar = user.avatar || user.channel?.avatar || null

    return (
        <Link to={`/channel/${user.id}`} className="inline-block">
            {avatar ? (
                <img 
                    src={avatar} 
                    alt={user.title || 'Аватар'}
                    className={`w-8 h-8 rounded-full object-cover border ${classes}`}
                />
            ) : (
                <span className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold ${text} ${classes}`}>
                    {user.name ? (user.name[0]?.toUpperCase() ?? 'U') : 'U'}
                </span>
            )}
        </Link>
    )
}