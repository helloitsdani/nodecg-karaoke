import { LineType } from "clrc"
import { motion, AnimatePresence } from "motion/react"
import classnames from "classnames"

import classes from "./Player.module.css"
import type { TrackLyricLine, TrackVoice } from "../../types"
import { memo } from "react"

interface LyricLineProps {
  line: TrackLyricLine
  nextLine?: TrackLyricLine
  voices: TrackVoice[]
}

interface LyricsProps {
  lines: TrackLyricLine[]
  voices: TrackVoice[]
  playing: boolean
  currentTime?: number
}

const PLACEHOLDER_LYRIC_LINE: TrackLyricLine = {
  type: LineType.LYRIC,
  lineNumber: -1,
  startMillisecond: -1,
  raw: "",
  content: "",
  parts: []
}

const useVisibleLyrics = (
  lines: TrackLyricLine[],
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
    lines[activeLineIdx + 1] as TrackLyricLine | undefined
  ] as const
}

const LyricsLine = memo(({ line, nextLine, voices }: LyricLineProps) => {
  if (line.content !== "") {
    return line.parts.map((part) => {
      const voice = voices[Number(part.vocalist)]
      const hasVocalist = !!voice?.vocalist
      const showVocalistVoice = hasVocalist && !part.continuation

      return (
        <span
          key={part.index}
          className={classnames(classes.Part, {
            [classes["Part--Voiced"]]: hasVocalist,
            [classes[`Vocalist--${voice?.vocalist?.name}`]]: showVocalistVoice
          })}
          style={
            voice
              ? {
                  "--vocalist-colour": voice.vocalist?.colour
                }
              : {}
          }
        >
          {part.content}
        </span>
      )
    })
  }

  if (!nextLine) {
    return ""
  }

  return <span className={classes.Part}>♪</span>
})

const Lyrics = ({
  lines,
  voices,
  playing = false,
  currentTime = 0
}: LyricsProps) => {
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
          <AnimatePresence mode="popLayout" initial={false}>
            {currentLine && (
              <motion.div
                key={currentLine.lineNumber}
                className={classes.Line}
                layout
                animate={{ scale: 1 }}
                exit={{ opacity: 0, y: "-100%" }}
                transition={{ duration: 0.33, ease: "easeOut" }}
              >
                <LyricsLine
                  line={currentLine}
                  nextLine={nextLine}
                  voices={voices}
                />
              </motion.div>
            )}

            {nextLine && (
              <motion.div
                key={nextLine.lineNumber}
                className={classes.Line}
                layout
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 0.65 }}
                transition={{
                  duration: 0.33,
                  ease: "easeOut",
                  delay: 0.15
                }}
              >
                <LyricsLine line={nextLine} voices={voices} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Lyrics
