import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";

export default function AvatarCropper({ onChangeAvatar }) {
    const [image, setImage] = useState(null)
    const [imgAfterCrop, setImgAfterCrop] = useState(null)
    const inputRef = useRef()

    const [crop, setCrop] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [croppedArea, setCroppedArea] = useState(null)

    const handleOnChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.onload = function () {
                setImage(reader.result)
            }
        }
    }

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels)
    }

    const onCropDone = (imgAfterCrop) => {
        setImage(null)

        const canvas = document.createElement('canvas')
        canvas.width = imgAfterCrop.width
        canvas.height = imgAfterCrop.height

        const context = canvas.getContext('2d')

        let imageObj1 = new Image()
        imageObj1.src = image
        imageObj1.onload = function () {
            context.drawImage(
                imageObj1,
                imgAfterCrop.x,
                imgAfterCrop.y,
                imgAfterCrop.width,
                imgAfterCrop.height,
                0,
                0,
                imgAfterCrop.width,
                imgAfterCrop.height
            )

            // Конвертирование содержимого canvas'а в blob
            canvas.toBlob((blob) => {
                const file = new File([blob], 'avatar.png', { type: 'image/png' })

                const dataUrl = canvas.toDataURL('image/png')
                setImgAfterCrop(dataUrl)

                onChangeAvatar(file)
            }, 'image/png')
        }
    }

    return (
        <>
            <input 
                type="file"
                accept="image/*"
                onChange={handleOnChange}
                ref={inputRef}
                style={{ display: 'none' }}

            />
            <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-light py-1 px-3 mb-1 rounded-lg transition"
                onClick={() => inputRef.current.click()}
            >
                Выберите изображение
            </button>

            {image && (
                <div className="flex flex-col items-center">
                    <div className="relative h-[200px] w-full">
                        <Cropper 
                            image={image}
                            aspect={1 / 1}
                            crop={crop}
                            zoom={zoom}
                            cropShape="round"
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            style={{
                                containerStyle: {
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#fff',
                                    borderRadius: '0.25rem'
                                }
                            }}
                        />
                    </div>
                    <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-light py-1 px-3 mt-1 rounded-lg transition"
                        onClick={() => onCropDone(croppedArea)}
                    >
                        Обрезать и применить
                    </button>
                </div>
            )}

            {imgAfterCrop && (
                <div className="flex flex-col items-center">
                    <img src={imgAfterCrop} className="w-20 h-20 rounded-full object-cover border" />
                </div>
            )}
        </>
    )

}