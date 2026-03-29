import { Link, useNavigate, useParams } from "react-router-dom";
import EntryForm from "../../components/form/EntryForm";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function EntryPage() {
    const { entryId } = useParams()
    const navigate = useNavigate()
    const [entry, setEntry] = useState({})
    const [entryLoadingError, setEntryLoadingError] = useState('')

    const isEdit = Boolean(entryId)

    const [loadingEntry, setLoadingEntry] = useState(isEdit)

    const handleSuccess = () => {
        navigate('/my-entries', { replace: true })
    }

    useEffect(() => {
        if (!isEdit) return

        (async () => {
            setLoadingEntry(true)
            setEntryLoadingError('')

            try {
                const { data } = await api.get(`/api/v1/user/entries/${entryId}`)

                setEntry(data.data ?? {})
            } catch (error) {
                console.log(error);
                setEntryLoadingError('Не удалось загрузить запись')
            } finally {
                setLoadingEntry(false)
            }
        })()
    }, [isEdit, entryId])

    if (loadingEntry) return <div className="py-10 text-center text-zinc-500">Загрузка...</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {entryLoadingError && (
                <p className="mb-4 text-lg text-center text-red-700">
                    {entryLoadingError}
                </p>
            )}
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900">
                    Новая запись
                </h1>
                <Link
                    to="/my-entries"
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                >
                    ← К списку
                </Link>
            </div>

            <EntryForm isEdit={isEdit} entry={entry} onSuccess={handleSuccess} />
        </div>
    )
}