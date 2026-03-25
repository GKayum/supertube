function toPx(size) {
    if (typeof size === "number") return size

    switch (size) {
        case "sm": return 16;
        case "lg": return 48;
        default:   return 24;
    }
}

export default function Spinner({
    size = "md",
    strokeWidth = 3,
    label = "Загрузка...",
    className = "",
}) {
    const px = toPx(size)
    const r = 20
    const c = 2 * Math.PI * r

    return (
        <div
            role="status"
            aria-label={label}
            aria-live="polite"
            className={`inline-flex items-center justify-center ${className}`}
            style={{ width: px, height: px }}
        >
            <svg
                className="animate-spin"
                viewBox="0 0 50 50"
                width={px}
                height={px}
            >
                {/* трек (светлая дорожка) */}
                <circle
                    cx="25"
                    cy="25"
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="opacity-20"
                    stroke="currentColor"
                />
                {/* бегущий сегмент */}
                <circle
                    cx="25"
                    cy="25"
                    r={r}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${c * 0.25} ${c}`} // длина дуги ~25%
                    strokeDashoffset="0"
                    className="origin-center"
                    style={{ transform: "rotate(-90deg)" }}
                    stroke="currentColor"
                />
            </svg>
            <span className="sr-only">{label}</span>
        </div>
    )
}