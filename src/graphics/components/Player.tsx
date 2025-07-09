import { Suspense, useState } from "react"
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
        src={track?.song}
        onTimeUpdate={(newPlayheadPosition) => {
          console.log(newPlayheadPosition)
          setPlayheadPosition(newPlayheadPosition)
        }}
      />

      <Suspense fallback="uh">
        <Lyrics src={track?.lyrics} />
      </Suspense>
    </>
  )
}

export default Player
