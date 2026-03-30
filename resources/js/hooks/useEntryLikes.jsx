import { useState } from "react";
import { EntryLikesService } from "../services/entryLikes";

export function useEntryLikes(initialLikes = 0, initialDislikes = 0) {
    const [likesCount, setLikesCount] = useState(initialLikes)
    const [dislikesCount, setDislikesCount] = useState(initialDislikes)
    const [isLiking, setIsLiking] = useState(false)

    const handleLike = async (entryId, event) => {
        if (event) {
            event.preventDefault()
            event.stopPropagation()
        }

        if (isLiking || !entryId) return

        setIsLiking(true)
        try {
            const response = await EntryLikesService.like(entryId)
            setLikesCount(response.likes)
            setDislikesCount(response.dislikes)
            return response
        } catch (error) {
            console.error('Ошибка при лайке записи:', error);
            throw error
        } finally {
            setIsLiking(false)
        }
    }

    const handleDislike = async (entryId, event) => {
        if (event) {
            event.preventDefault()
            event.stopPropagation()
        }

        if (isLiking || !entryId) return

        setIsLiking(true)
        try {
            const response = await EntryLikesService.dislike(entryId)
            setLikesCount(response.likes)
            setDislikesCount(response.dislikes)
            return response
        } catch (error) {
            console.error('Ошибка при дизлайке записи:', error);
            throw error
        } finally {
            setIsLiking(false)
        }
    }

    const updateCounts = (likes, dislikes) => {
        setLikesCount(likes)
        setDislikesCount(dislikes)
    }

    return {
        likesCount,
        dislikesCount,
        isLiking,
        handleLike,
        handleDislike,
        updateCounts
    }
}