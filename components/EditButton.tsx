// components/EditButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function EditButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/admin/edit/${id}`)}
      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
    >
      Edit
    </button>
  );
}
