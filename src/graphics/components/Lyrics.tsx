import { useMemo } from "react"
import { LineType, parse, type LyricLine } from "clrc"
import { useSuspenseQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "motion/react"

import classes from "./Player.module.css"

interface LyricsProps {
  src?: string
  currentTime?: number
}

interface Metadata {
  ti: string
  ar: string
}

const PLACEHOLDER_LYRIC_LINE: LyricLine = {
  type: LineType.LYRIC,
  startMillisecond: -1,
  raw: "",
  content: "",
  lineNumber: -1
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
    () =>
      lines
        .filter((line) => line.type === LineType.METADATA)
        .reduce<Metadata>(
          (meta, line) => {
            meta[line.key as keyof Metadata] = line.value
            return meta
          },
          {
            ti: "Untitled",
            ar: "Unknown Artist"
          }
        ),
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

  return [
    lines[activeLineIdx] ?? PLACEHOLDER_LYRIC_LINE,
    lines[activeLineIdx + 1] ?? PLACEHOLDER_LYRIC_LINE
  ]
}

const Lyrics = ({ src, currentTime = 0 }: LyricsProps) => {
  const [lyrics, metadata] = useLyrics(src)
  const [currentLine, nextLine] = useVisibleLyrics(lyrics, currentTime, 300)

  return (
    <>
      <motion.div
        key={src}
        className={classes.Title}
        layout
        initial={{ opacity: 0, y: "10%" }}
        animate={{ opacity: 1, y: 0, x: 0, transition: { delay: 0.33 } }}
        exit={{ opacity: 0, x: "-10%" }}
        transition={{ duration: 0.33, ease: "easeInOut" }}
      >
        {metadata.ar} - {metadata.ti}
      </motion.div>

      <motion.div
        className={classes.Lines}
        animate={{ opacity: currentTime > 0 ? 1 : 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.33, ease: "easeOut" }}
      >
        <AnimatePresence key={src}>
          {currentLine && (
            <motion.div
              key={currentLine.lineNumber}
              className={classes.Line}
              layout
              animate={{ scale: 1 }}
              exit={{ opacity: 0, marginTop: "-56px" }}
              transition={{ duration: 0.33, ease: "easeInOut" }}
            >
              {currentLine.content !== "" ? currentLine.content : "♪"}
            </motion.div>
          )}

          {nextLine && (
            <motion.div
              key={nextLine.lineNumber}
              className={classes.Line}
              layout
              initial={{ opacity: 0, scale: 0.65 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.33, ease: "easeInOut", delay: 0.15 }}
            >
              {nextLine.content !== "" ? nextLine.content : "♪"}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default Lyrics
