import { useState } from "react"
import { useReplicant } from "@nodecg/react-hooks"

import type { Track } from "../../types"

import Lyrics from "./Lyrics"
import Audio from "./Audio"

const Player = () => {
  const [track] = useReplicant<Track>("track")
  const [playheadPosition, setPlayheadPosition] = useState(0)

  return (
    <>
      {JSON.stringify(track)}
      {playheadPosition}

      <Audio
        song={track?.song}
        onTimeUpdate={(newPlayheadPosition) => {
          console.log(newPlayheadPosition)
          setPlayheadPosition(newPlayheadPosition)
        }}
      />

      <Lyrics />
    </>
  )
}

export default Player
