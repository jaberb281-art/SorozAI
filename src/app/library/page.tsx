import { LibraryClient } from "./library-client"
import { getLibrary } from "@/lib/api-client"

export default async function LibraryPage() {
  const library = await getLibrary()

  return <LibraryClient songs={library.songs} />
}
