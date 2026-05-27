import { FeedClient } from "./feed-client"
import { getExploreFeed } from "@/lib/api-client"

export default async function FeedPage() {
  const feed = await getExploreFeed()

  return <FeedClient songs={feed.songs} />
}
