export default function FormVideo({
    title,
    description,
    previewUrl,
    currentPreviewUrl,
    titleError,
    validationErrors,
    previewError,
    uploading,
    isEdit = false,
    onTitleChange,
    onDescriptionChange,
    onPreviewChange,
    onFileChange,
    showFileInput = true,
    fileError,
    file,
    onSubmit,
    error,
    message,
    isError,
    uploadProgress
}) {
    return (
        <>
            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Название видео</label>
                <input 
                    type="text"
                    value={title}
                    onChange={onTitleChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${titleError || validationErrors.title ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Введите название видео..."
                />
                {titleError ? (
                    <p className="text-red-500 text-sm mt-1">{titleError}</p>
                ) : (
                    <p className="text-sm mt-1 invisible">.</p>
                )}
                {validationErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.title[0]}</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Описание видео</label>
                <textarea
                    rows='5'
                    value={description}
                    onChange={onDescriptionChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${validationErrors.description ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Введите описание видео..."
                />
                {validationErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.description[0]}</p>
                )}
            </div>

            {showFileInput && (
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Выберите файл</label>
                    <input 
                        type="file"
                        accept="video/*"
                        onChange={onFileChange}
                        className={`w-full ${fileError ? 'border-red-400' : ''}`}
                    />
                    {fileError ? (
                        <p className="text-red-500 text-sm mt-1">{fileError}</p>
                    ) : (
                        <p className="text-sm mt-1 invisible">.</p>
                    )}
                    {validationErrors.video && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.video[0]}</p>
                    )}
                </div>
            )}

            {(file && showFileInput) && (
                <div className="mb-4">
                    <video 
                        src={URL.createObjectURL(file)}
                        controls
                        className="w-full rounded-lg" 
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Превью обложка</label>
                <input 
                    type="file"
                    accept="image/*"
                    onChange={onPreviewChange}
                    className="w-full"
                />

                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mt-2 w-[480px] border rounded" />
                ) : currentPreviewUrl ? (
                    <img src={currentPreviewUrl} alt="Preview" className="mt-2 w-[480px] border rounded" />
                ) : null}

                {validationErrors.preview && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.preview[0]}</p>
                )}

                {previewError && (
                    <div className="text-red-500 text-sm mt-2">{previewError}</div>
                )}
            </div>

            <button
                onClick={onSubmit}
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
                {uploading 
                    ? (isEdit ? 'Сохраняем...' : 'Загрузка...')
                    : (isEdit ? 'Сохранить изменения' : 'Загрузить видео')
                }
            </button>

            {uploading && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%`}}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-2 text-center rounded-lg bg-red-100 text-red-600">
                    {error}
                </div>
            )}

            {message && (
                <div className={`mt-4 p-2 text-center rounded-lg ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {message}
                </div>
            )}
        </>
    )
}