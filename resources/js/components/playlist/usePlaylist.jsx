import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api"

export function usePlaylist(listId, currentVideoId) {
    const [playlist, setPlaylist] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            if (!listId) {
                setPlaylist(null)
                return
            }
            try {
                const response = await api.get(`/api/v1/playlist/${listId}`)
                setPlaylist(response.data.data)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [listId])

    const items = useMemo(() => playlist?.videos ?? [], [playlist])
    const activeIndex = useMemo(
        () => items.findIndex(v => String(v.id) === String(currentVideoId)), 
        [items, currentVideoId]
    )

    return {
        playlist,
        items,
        loading,
        activeIndex,
        count: items.length,
        title: playlist?.title ?? '',
    }
}