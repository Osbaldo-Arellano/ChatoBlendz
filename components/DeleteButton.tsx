'use client';

export default function DeleteButton({
  id,
  onDelete,
}: {
  id: string;
  onDelete: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onDelete(id)}
      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
    >
      Delete
    </button>
  );
}
