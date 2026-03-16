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
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
                    disabled={activeIndex <= 0}
                >
                    ◀ Предыдущее
                </button>

                <button
                    onClick={onNext}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
                    disabled={activeIndex < 0 || activeIndex >= count - 1}
                >
                    ▶ Следующее
                </button>
            </div>
        </div>
    )
}