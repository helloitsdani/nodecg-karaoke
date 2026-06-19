import { motion, AnimatePresence } from "motion/react"
import classnames from "classnames"

import classes from "./Player.module.css"
import type { TrackLyricLine, TrackVoice, Vocalist } from "../../types"
import { memo, useMemo } from "react"
import { LineType } from "clrc"
import { Countdown } from "./Countdown"

interface LyricLineProps {
  line: TrackLyricLine
  isLastLine: boolean
  voices: TrackVoice[]
  dedupeVocalistIcons?: boolean
  currentTime?: number
}

interface LyricsProps {
  lines: TrackLyricLine[]
  voices: TrackVoice[]
  offset: number
  playing: boolean
  currentTime?: number
}

const PLACEHOLDER_LYRIC_LINE: TrackLyricLine = {
  type: LineType.LYRIC,
  lineNumber: 0,
  lyricLineNumber: 0,
  startMillisecond: 0,
  raw: "",
  content: "",
  parts: [],
  duration: null
}

const BACKING_VOCALIST: Vocalist = {
  name: "backing"
}

const useVisibleLyrics = (
  lines: TrackLyricLine[],
  currentTime: number,
  offset: number = 0,
  leadTime: number = 0
) =>
  useMemo(() => {
    const activeLineStart = currentTime + leadTime
    let activeLineIdx = -1

    for (let idx = 0; idx < lines.length; idx++) {
      const lineStart = lines[idx]?.startMillisecond + offset
      if (lineStart > activeLineStart) {
        break
      }

      activeLineIdx = idx
    }

    let activeLine: TrackLyricLine
    const nextLine = lines[activeLineIdx + 1] as TrackLyricLine | undefined

    if (activeLineIdx === -1) {
      activeLine = {
        ...PLACEHOLDER_LYRIC_LINE,
        duration: (lines[0]?.startMillisecond ?? 0) + offset
      }
    } else {
      activeLine = lines[activeLineIdx] ?? PLACEHOLDER_LYRIC_LINE
    }

    return [activeLine, nextLine] as const
  }, [lines, currentTime, offset, leadTime])

const LyricsLine = memo(
  ({
    line,
    isLastLine,
    voices,
    currentTime,
    dedupeVocalistIcons = false
  }: LyricLineProps) => {
    if (line.content === "") {
      if (isLastLine) {
        return ""
      }

      return (
        <span className={classnames(classes.Part, classes["Part--empty"])}>
          <span className={classes["Part--placeholder"]}>♪</span>{" "}
          {line.duration && (
            <Countdown
              start={line.startMillisecond}
              duration={line.duration}
              time={currentTime}
            />
          )}
        </span>
      )
    }

    return line.parts.map((part) => {
      const voice = voices[Number(part.vocalist)]
      const isBackingVocalist = part.vocalist === "-1"
      const vocalist =
        part.vocalist === "-1" ? BACKING_VOCALIST : voice?.vocalist
      const showVocalistVoice = dedupeVocalistIcons
        ? !part.continuation && !!vocalist
        : true

      return (
        <span
          key={part.index}
          className={classnames(classes.Part, {
            [classes["Part--Voiced"]]: !!vocalist && !isBackingVocalist,
            [classes[`Vocalist--${vocalist?.name}`]]: showVocalistVoice
          })}
          style={
            voice
              ? {
                  "--vocalist-colour": vocalist?.colour
                }
              : {}
          }
        >
          {part.content}
        </span>
      )
    })
  }
)

const Lyrics = ({
  lines,
  voices,
  offset,
  playing = false,
  currentTime = 0
}: LyricsProps) => {
  const [currentLine, nextLine] = useVisibleLyrics(
    lines,
    currentTime,
    offset,
    200
  )

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
                  currentTime={currentTime}
                  isLastLine={currentLine.lyricLineNumber === lines.length}
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
                <LyricsLine
                  line={nextLine}
                  isLastLine={nextLine.lyricLineNumber === lines.length}
                  voices={voices}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Lyrics
