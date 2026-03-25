import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import ShortCard from "@/components/short/ShortCard";
import Spinner from "@/components/ui/Spinner";

export default function MyShorts() {
    const [items, setItems] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const bottomRef = useRef(null)

    useEffect(() => {
        let observer = null

        if (bottomRef.current) {
            observer = new IntersectionObserver((entries) =>{
                const first = entries[0]

                if (first.isIntersecting && hasMore && !loading) {
                    setPage((p) => p + 1)
                }
            })

            observer.observe(bottomRef.current)
        }

        return () => observer?.disconnect()
    }, [bottomRef.current, hasMore, loading])

    useEffect(() => {
        const load = async () => {
            if (!hasMore || loading) return

            setLoading(true)
            setError(null)

            try {
                const { data } = await api.get(`/api/v1/user/shorts`, {
                    params: { page, per_page: 20 },
                })

                const newItems = data?.data ?? []
                setItems((prev) => (page === 1 ? newItems : [...prev, ...newItems]))

                const meta = data?.meta ?? {}

                if (meta?.current_page && meta?.last_page) {
                    setHasMore(meta.current_page < meta.last_page)
                } else {
                    setHasMore(newItems.length > 0)
                }
            } catch (error) {
                setError(error?.message ?? 'Ошибка загрузки')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [page])

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold mb-4">Мои шортсы</h1>

            {!loading && items.length === 0 && !error && (
                <div className="text-center text-gray-400 py-24">
                    У вас нету шортсов.
                </div>
            )}

            {error && (
                <div className="mb-4 rounded bg-red-950/40 border border-red-500/40 text-red-200 p-3">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {items.map((short) => (
                    <ShortCard
                        id={short.id}
                        title={short.title}
                        coverUrl={short.preview480}
                        videoUrl={short.path}
                        views={short.views ?? 0}
                    />
                ))}
            </div>

            <div ref={bottomRef} className="h-8" />

            {loading && (
                <div className="flex justify-center py-6">
                    <Spinner />
                </div>
            )}
        </div>
    )
}