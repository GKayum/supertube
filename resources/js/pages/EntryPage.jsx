import { Link, useNavigate } from "react-router-dom";
import EntryForm from "../components/form/EntryForm";

export default function EntryPage() {
    const navigate = useNavigate()

    const handleSuccess = (data) => {
        // Если вернул id → уводим на страницу редактирования/просмотра
        if (data?.id) {
            navigate(`/studio/entries/${data.id}/edit`, { replace: true })
            return
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-zinc-900">
                    Новая запись
                </h1>
                <Link
                    to="/studio/entries"
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                >
                    ← К списку
                </Link>
            </div>

            <EntryForm isEdit={false} onSuccess={handleSuccess} />
        </div>
    )
}