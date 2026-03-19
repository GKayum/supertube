import { useEffect, useMemo, useState } from "react";
import { api, handlerApiError } from '../../services/api'

export default function FiltersPanel({
    value,
    onChange,
    defaultOpen = false,
    className = ''
}) {
    const [open, setOpen] = useState(defaultOpen)
    const [loading, setLoading] = useState(true)
    const [opts, setOpts] = useState({
        date: [],
        type: [],
        duration: [],
        order: [],
    })
    const [error, setError] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/api/v1/search/filters')
                setOpts(data || {})
            } catch (error) {
                handlerApiError(error, { setValidationErrors: () => {}, setError })
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const pillBase = 'px-3 py-1.5 text-sm rounded-full border transition whitespace-nowrap'
    const pillActive = 'bg-red-600 text-white borde-red-600 hover:bg-red-700'
    const pillIdle = 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'

    const sections = useMemo(() => ([
        { key: 'date', title: 'По дате загрузки' },
        { key: 'type', title: 'Тип' },
        { key: 'duration', title: 'По длительности' },
        { key: 'order', title: 'Упорядочить' },
    ]), [])

    return (
        <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="font-semibold">Фильтры</div>
                <button
                    type="button"
                    onClick={() => setOpen(prev => !prev)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:"
                >
                    {/* SVG */}
                    {open ? 'Скрыть' : 'Показать'}
                </button>
            </div>

            {open && (
                <>
                    {loading ? (
                        <div className="px-4 pb-4 text-sm text-gray-500">Загрузка фильтров...</div>
                    ) : error ? (
                        <div className="px-4 pb-4 text-sm text-red-600">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-4">
                            {sections.map(section => (
                                <div key={section.key}>
                                    <div className="text-sm font-semibold text-gray-700 mb-2">{section.title}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {(opts[section.key] ?? []).map(opt => {
                                            const active = value?.[section.key] === opt.key

                                            return (
                                                <button
                                                    key={opt.key ?? "_empty"}
                                                    type="button"
                                                    className={`${pillBase} ${active ? pillActive : pillIdle} cursor-pointer`}
                                                    onClick={() => onChange?.({ ...value, [section.key]: opt.key })}
                                                >
                                                    {opt.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
                        Фильтры применяются автоматически
                    </div>
                </>
            )}
        </div>
    )
}