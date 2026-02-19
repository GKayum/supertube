export default function Cover(file, width, height) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.src = objectUrl

        img.onload = () => {
            if (img.width === width && img.height === height) {
                resolve(objectUrl)
            } else {
                reject(`Размер обложки должен быть строго ${width}x${height} пикселей.`)
            }
        }

        img.onerror = () => {
            reject('Не удалось прочитать изображение.')
        }
    })
}