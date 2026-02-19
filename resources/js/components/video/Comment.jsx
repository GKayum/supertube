export default function Comment({ comment }) {
    return (
        <div className="flex items-start space-x-4">
            <img src="/avatar.jpg" alt="User" className="w-9 h-9 rounded-full" />
            <div>
                <p className="font-medium text-gray-800">{comment.user.name}</p>
                <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
            </div>
        </div>
    )
}