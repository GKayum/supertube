function formatDuration(total) {
    const s = Math.max(0, Number(total) | 0)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60

    return h > 0
        ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        : `${m}:${String(sec).padStart(2, '0')}`
}

export default function DurationBadge({ seconds }) {
    const text =
        seconds != null
            ? formatDuration(seconds)
            : '—:—'
    
    return (
        <span className="absolute bottom-2 right-2 rounded px-1.5 py-0.5 text-xs font-semibold text-white bg-black/70">
            {text}
        </span>
    )
}