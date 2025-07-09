import { useSuspenseQuery } from "@tanstack/react-query"
import { parse } from "clrc"

interface LyricsProps {
  src?: string
  time?: number
}

const fetchLyrics = async (src?: string) => {
  if (!src) {
    throw new TypeError()
  }

  const response = await fetch(src ?? "")
  const plainLyrics = await response.text()

  return parse(plainLyrics)
}

const Lyrics = ({ src, time = 0 }: LyricsProps) => {
  const { data: lyrics } = useSuspenseQuery({
    queryKey: ["lyrics", src],
    queryFn: () => fetchLyrics(src)
  })

  return (
    <div>
      {lyrics.map((line) => (
        <div key={line.lineNumber}>{JSON.stringify(line)}</div>
      ))}
    </div>
  )
}

export default Lyrics
