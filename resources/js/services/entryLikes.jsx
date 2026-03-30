import { api } from "./api";
import { getFingerprint } from './fingerprint'

export class EntryLikesService {
    static async like(entryId) {
        try {
            const fingerprint = await getFingerprint()
            const response = await api.post(`/api/v1/entries/${entryId}/like`, {
                fingerprint
            })
            return response.data
        } catch (error) {
            console.error('Ошибка при лайке записи:', error);
            throw error
        }
    }

    static async dislike(entryId) {
        try {
            const fingerprint = await getFingerprint()
            const response = await api.post(`/api/v1/entries/${entryId}/dislike`, {
                fingerprint
            })
            return response.data
        } catch (error) {
            console.error('Ошибка при дизлайке записи:', error);
            throw error
        }
    }

    static async getLikes(entryId) {
        try {
            const response = await api.get(`/api/v1/entries/${entryId}/likes`)
            return response.data
        } catch (error) {
            console.error('Ошибка при получении лайков записи:', error);
            throw error
        }
    }
}