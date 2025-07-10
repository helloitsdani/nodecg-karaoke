import { Suspense, useState } from "react"
import { useReplicant } from "@nodecg/react-hooks"

import type { Track } from "../../types"

import Lyrics from "./Lyrics"
import Audio from "./Audio"

const Player = () => {
  const [track] = useReplicant<Track>("track")
  const [currentTime, setCurrentTime] = useState(0)

  return (
    <>
      <Audio
        src={track?.song}
        onTimeUpdate={(newPlayheadPosition) => {
          setCurrentTime(newPlayheadPosition * 1000)
        }}
      />

      <Suspense>
        <Lyrics src={track?.lyrics} currentTime={currentTime} />
      </Suspense>
    </>
  )
}

export default Player
