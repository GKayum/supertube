import { useRef, useState } from "react";

export default function CoverCropper({
    aspectWidth = 1200,
    aspectHeight = 300,
    onChange,
    className = '',
    buttonText = 'Загрузить обложку',
}) {
    const inputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [loading, setLoading] = useState(false)

    const onFile = async (file) => {
        if (!file) return
        setLoading(true)

        const img = new Image()
        img.onload = () => {
            // Центр-кроп под нужный аспект
            const targetRatio = aspectWidth / aspectHeight
            const srcRatio = img.width / img.height

            let sx, sy, sw, sh
            if (srcRatio > targetRatio) {
                // ширина лишняя - обрезаем по бокам
                sh = img.height
                sw = Math.floor(sh * targetRatio)
                sx = Math.floor((img.width - sw) / 2)
                sy = 0
            } else {
                // высота лишняя - обрезаем сверху/снизу
                sw = img.width
                sh = Math.floor(sw / targetRatio)
                sx = 0
                sy = Math.floor((img.height - sh) / 2)
            }

            const canvas = document.createElement('canvas')
            canvas.width = aspectWidth
            canvas.height = aspectHeight

            const ctx = canvas.getContext('2d')
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, aspectWidth, aspectHeight)

            canvas.toBlob(
                (blob) => {
                    setLoading(false)
                    if (!blob) return
                    const url = URL.createObjectURL(blob)
                    setPreviewUrl(url)
                    onChange?.(blob)
                },
                'image/webp',
                0.9
            )
        }

        const reader = new FileReader()
        reader.onload = (e) => (img.src = e.target.result)
        reader.readAsDataURL(file)
    }

    const onInputChange = (e) => onFile(e.target.files?.[0])

    const clear = () => {
        setPreviewUrl(null)
        onChange?.(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className={className}>
            <div className="flex items-center gap-3">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onInputChange}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 file:transition"
                />
                {previewUrl && (
                    <button
                        type="button"
                        onClick={clear}
                        className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        Очистить
                    </button>
                )}
            </div>

            {loading && (
                <div className="text-sm text-gray-500 mt-2">Обработка изображения...</div>
            )}

            {previewUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border">
                    <img 
                        src={previewUrl}
                        alt="Предпросмотр обложки"
                        className="w-full h-32 md:h-40 object-cover"
                    />
                </div>
            )}
        </div>
    )
}