export default function PlaylistTopbar({ title, activeIndex, count, onPrev, onNext }) {
    if (!count) return null

    return (
        <div className="mb-3 p-3 rounded-lg bg-gray-100 flex items-center justify-between">
            <div>
                <div className="text-sm text-gray-600">Плейлист</div>
                <div className="font-semibold text-gray-900">{title}</div>
                <div className="text-xs text-gray-500">
                    {activeIndex >= 0 ? `${activeIndex + 1} / ${count}` : `${count} видео`}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    className="flex items-end gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
                    disabled={activeIndex <= 0}
                >
                    <svg
                        className="bg-blue-400 rounded p-1"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#fff"
                    >
                        <path d="M19 5a2 2 0 0 0-3.008-1.728l-11.997 6.998a2 2 0 0 0-.003 3.458l12 7A2 2 0 0 0 19 19z" />
                    </svg>
                    <span style={{ lineHeight: 'normal' }}>Предыдущее</span>
                </button>

                <button
                    onClick={onNext}
                    className="flex items-end gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
                    disabled={activeIndex < 0 || activeIndex >= count - 1}
                >
                    <span style={{ lineHeight: 'normal' }}>Следующее</span>
                    <svg
                        className="bg-blue-400 rounded p-1"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#fff"
                    >
                        <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}