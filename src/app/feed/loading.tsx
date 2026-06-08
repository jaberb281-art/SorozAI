import { FeedPageSkeleton } from "@/components/ui/skeletons"

export default function FeedLoading() {
  return (
    <div className="px-4 py-6">
      <FeedPageSkeleton cards={12} />
    </div>
  )
}
