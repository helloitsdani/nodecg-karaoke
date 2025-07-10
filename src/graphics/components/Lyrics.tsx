import { useSuspenseQuery } from "@tanstack/react-query"
import { LineType, parse, type LyricLine } from "clrc"
import { useMemo } from "react"

interface LyricsProps {
  src?: string
  currentTime?: number
}

const fetchLyrics = async (src?: string) => {
  if (!src) {
    throw new TypeError()
  }

  const response = await fetch(src ?? "")
  const plainLyrics = await response.text()

  return parse(plainLyrics)
}

const useLyrics = (src?: string) => {
  const { data: lines } = useSuspenseQuery({
    queryKey: ["lyrics", src],
    queryFn: () => fetchLyrics(src)
  })

  const lyrics = useMemo(
    () => lines.filter((line) => line.type === LineType.LYRIC),
    [lines]
  )
  const metadata = useMemo(
    () => lines.filter((line) => line.type === LineType.METADATA),
    [lines]
  )

  return [lyrics, metadata] as const
}

const useVisibleLyrics = (
  lines: Array<LyricLine>,
  currentTime: number,
  leadTime: number = 0
): Array<LyricLine | undefined> => {
  const activeLineStart = currentTime + leadTime
  let activeLineIdx = -1

  for (let idx = 0; idx <= lines.length; idx++) {
    if (lines[idx]?.startMillisecond > activeLineStart) {
      break
    }

    activeLineIdx = idx
  }

  return [lines[activeLineIdx], lines[activeLineIdx + 1]]
}

const Lyrics = ({ src, currentTime = 0 }: LyricsProps) => {
  const [lyrics] = useLyrics(src)
  const [currentLine, nextLine] = useVisibleLyrics(lyrics, currentTime, 250)

  return (
    <>
      <h1>{currentLine?.content}</h1>
      <h2>{nextLine?.content}</h2>
      <div>
        {lyrics.map((line) => (
          <div key={line.lineNumber}>{JSON.stringify(line)}</div>
        ))}
      </div>
    </>
  )
}

export default Lyrics
