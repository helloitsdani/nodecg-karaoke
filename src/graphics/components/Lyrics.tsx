import { LineType, type LyricLine } from "clrc"
import { motion, AnimatePresence } from "motion/react"

import classes from "./Player.module.css"

interface LyricsProps {
  lines: Array<LyricLine>
  playing: boolean
  currentTime?: number
}

const PLACEHOLDER_LYRIC_LINE: LyricLine = {
  type: LineType.LYRIC,
  startMillisecond: -1,
  raw: "",
  content: "",
  lineNumber: -1
}

const useVisibleLyrics = (
  lines: Array<LyricLine>,
  currentTime: number,
  leadTime: number = 0
) => {
  const activeLineStart = currentTime + leadTime
  let activeLineIdx = -1

  for (let idx = 0; idx < lines.length; idx++) {
    if (lines[idx]?.startMillisecond > activeLineStart) {
      break
    }

    activeLineIdx = idx
  }

  return [
    lines[activeLineIdx] ?? PLACEHOLDER_LYRIC_LINE,
    lines[activeLineIdx + 1] as LyricLine | undefined
  ] as const
}

const Lyrics = ({ lines, playing = false, currentTime = 0 }: LyricsProps) => {
  const [currentLine, nextLine] = useVisibleLyrics(lines, currentTime, 300)

  return (
    <AnimatePresence propagate>
      {playing && (
        <motion.div
          key={`lines-${lines.length}`}
          className={classes.Lines}
          initial={{ opacity: 0, y: "10%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-10%" }}
          transition={{ duration: 0.33, ease: "easeOut" }}
        >
          <AnimatePresence initial={false}>
            {currentLine && (
              <motion.div
                key={currentLine.lineNumber}
                data-line={currentLine.lineNumber}
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
                data-line={nextLine.lineNumber}
                className={classes.Line}
                layout
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 0.65 }}
                transition={{
                  duration: 0.33,
                  ease: "easeInOut",
                  delay: 0.15
                }}
              >
                {nextLine.content !== "" ? nextLine.content : "♪"}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Lyrics
