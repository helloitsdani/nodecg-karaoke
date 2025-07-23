import { useEffect, useState } from "react"
import { useListenFor } from "@nodecg/react-hooks"
import { motion, AnimatePresence } from "motion/react"

import Lyrics from "./Lyrics"
import Audio from "./Audio"

import classes from "./Player.module.css"
import { useTrack } from "../hooks/useTrack"

const Player = () => {
  const track = useTrack()
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useListenFor("track.start", () => {
    setPlaying(true)
  })

  useListenFor("track.stop", () => {
    setPlaying(false)
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: rerun when track changes
  useEffect(() => {
    setPlaying(false)
  }, [track])

  return (
    <>
      <div className={classes.NowPlaying}>
        <span className={classes.NowPlaying__Label}>Now Playing ♪</span>

        <AnimatePresence propagate>
          <motion.div
            key={`${track?.src}-title`}
            className={classes.NowPlaying__Title}
            layout
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.33 } }}
            exit={{ opacity: 0, y: "-10%" }}
            transition={{ duration: 0.33, ease: "easeInOut" }}
          >
            {track?.artist} - {track?.title}
          </motion.div>
        </AnimatePresence>
      </div>

      <Audio
        src={track?.src}
        playing={playing}
        onTimeUpdate={(newPlayheadPosition) => {
          setCurrentTime(Math.round(newPlayheadPosition * 1000))
        }}
      />

      <AnimatePresence propagate>
        {track && (
          <Lyrics
            key={`${track.src}-lyrics`}
            lines={track.lyrics}
            playing={playing}
            currentTime={currentTime}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Player
