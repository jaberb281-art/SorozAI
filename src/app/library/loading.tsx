import { LibraryPageSkeleton } from "@/components/ui/skeletons"

export default function LibraryLoading() {
  return (
    <div className="px-4 py-6">
      <LibraryPageSkeleton rows={8} />
    </div>
  )
}
