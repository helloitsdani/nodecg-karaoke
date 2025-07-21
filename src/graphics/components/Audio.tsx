import { useEffect, useRef } from "react"

interface AudioProps {
  src?: string
  playing: boolean
  onTimeUpdate?: (newPlayheadPosition: number) => void
}

const Audio = ({ src = "", playing = false, onTimeUpdate }: AudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (playing) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [playing])

  useEffect(() => {
    const onTimeUpdateEvent = () => {
      onTimeUpdate?.(audioRef.current?.currentTime ?? 0)
    }

    const onTimeResetEvent = () => {
      onTimeUpdate?.(0)
    }

    audioRef.current?.addEventListener("loadeddata", onTimeResetEvent)
    audioRef.current?.addEventListener("ended", onTimeResetEvent)
    audioRef.current?.addEventListener("timeupdate", onTimeUpdateEvent)

    return () => {
      audioRef.current?.removeEventListener("loadeddata", onTimeResetEvent)
      audioRef.current?.removeEventListener("ended", onTimeResetEvent)
      audioRef.current?.removeEventListener("timeupdate", onTimeUpdateEvent)
    }
  }, [onTimeUpdate])

  return <audio key={src} src={src} hidden ref={audioRef} />
}

export default Audio
