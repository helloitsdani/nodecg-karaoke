import { useListenFor } from "@nodecg/react-hooks"
import { useEffect, useRef } from "react"

interface AudioProps {
  song?: string
  onTimeUpdate?: (newPlayheadPosition: number) => void
}

const Audio = ({ song = "", onTimeUpdate }: AudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useListenFor("track.start", () => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.play()
  })

  useListenFor("track.stop", () => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.pause()
    audioRef.current.currentTime = 0
  })

  useEffect(() => {
    const onTimeUpdateEvent = () => {
      onTimeUpdate?.(audioRef.current?.currentTime ?? 0)
    }

    audioRef.current?.addEventListener("timeupdate", onTimeUpdateEvent)

    return () => {
      audioRef.current?.removeEventListener("timeupdate", onTimeUpdateEvent)
    }
  }, [onTimeUpdate])

  return <audio hidden src={song} ref={audioRef} />
}

export default Audio
