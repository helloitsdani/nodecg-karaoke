import { Suspense, useState } from "react"
import { useReplicant } from "@nodecg/react-hooks"

import type { Track } from "../../types"

import Lyrics from "./Lyrics"
import Audio from "./Audio"

import classes from "./Player.module.css"
import { AnimatePresence } from "motion/react"

const Player = () => {
  const [track] = useReplicant<Track>("track")
  const [currentTime, setCurrentTime] = useState(0)

  return (
    <>
      <div className={classes.NowPlaying}>
        <span className={classes.NowPlaying__Label}>Now Playing ♪</span>
      </div>

      <Audio
        src={track?.song}
        onTimeUpdate={(newPlayheadPosition) => {
          setCurrentTime(newPlayheadPosition * 1000)
        }}
      />

      <AnimatePresence propagate>
        <Suspense>
          <Lyrics src={track?.lyrics} currentTime={currentTime} />
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default Player
