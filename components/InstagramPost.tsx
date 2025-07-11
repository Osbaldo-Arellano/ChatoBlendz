import Image from 'next/image';

export default function InstagramPost() {
  return (
    <div className="max-w-md border border-gray-300 rounded-md bg-white shadow-sm mx-auto my-4">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <Image
          src="/images/chato.png" // replace with actual avatar
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="ml-3 font-semibold text-sm">username</span>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gray-100 relative">
        <Image
          src="/post.jpg" // replace with actual post image
          alt="Instagram post"
          fill
          className="object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between px-4 pt-3">
        <div className="flex space-x-4">
          <button>❤️</button>
          <button>💬</button>
          <button>📤</button>
        </div>
        <button>🔖</button>
      </div>

      {/* Caption */}
      <div className="px-4 pt-2 pb-1 text-sm">
        <span className="font-semibold">username</span>
        <span className="ml-2">This is a sample caption.</span>
      </div>

      {/* Timestamp */}
      <div className="px-4 pb-3 text-xs text-gray-500 uppercase">2 hours ago</div>
    </div>
  );
}
