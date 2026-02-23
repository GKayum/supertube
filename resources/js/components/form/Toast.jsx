import { useEffect } from "react";

export default function Toast({ message, type = 'info', visible, onClose, duration = 3000 }) {
    useEffect(() => {
        if (!visible) return

        const timer = setTimeout(() => {
            onClose?.()
        }, duration)

        return () => clearTimeout(timer)
    }, [visible, duration, onClose])

    const typeStyles = {
        info: 'bg-gray-800 text-white',
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
    }

    return (
        <div 
            className={`
                fixed z-50 left-1/2 -translate-x-1/2 bottom-8 px-6 py-3 rounded-xl
                shadow-lg flex items-center gap-2 transition-all duration-300
                ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                ${typeStyles[type] ?? typeStyles.info}    
            `}
            style={{ minWidth: '220px', maxWidth: '90vw' }}
            role="alert"
        >
            <span className="font-medium">{message}</span>

            <button onClick={onClose} className="ml-auto px-2 opacity-80 hover:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}