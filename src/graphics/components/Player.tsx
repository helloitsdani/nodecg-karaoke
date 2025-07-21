import { useEffect, useState } from "react"
import { useReplicant, useListenFor } from "@nodecg/react-hooks"

import type { Track } from "../../types"

import Lyrics from "./Lyrics"
import Audio from "./Audio"

import classes from "./Player.module.css"

const Player = () => {
  const [track] = useReplicant<Track>("track")
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
      </div>

      <Audio
        src={track?.song}
        playing={playing}
        onTimeUpdate={(newPlayheadPosition) => {
          setCurrentTime(newPlayheadPosition * 1000)
        }}
      />

      <Lyrics src={track?.lyrics} playing={playing} currentTime={currentTime} />
    </>
  )
}

export default Player
