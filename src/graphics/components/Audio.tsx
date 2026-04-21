import { useEffect, useRef } from "react"

interface AudioProps {
  src?: string
  playing: boolean
  onTimeUpdate?: (newPlayheadPosition: number) => void
  onFinish?: () => void
}

const Audio = ({
  src = "",
  playing = false,
  onTimeUpdate,
  onFinish
}: AudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (playing) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [playing])

  useEffect(() => {
    const onFinishEvent = () => {
      onFinish?.()
    }

    const onTimeUpdateEvent = () => {
      onTimeUpdate?.(audioRef.current?.currentTime ?? 0)
    }

    const onTimeResetEvent = () => {
      if (!audioRef.current) {
        return
      }

      audioRef.current.currentTime = 0
    }

    audioRef.current?.addEventListener("loadeddata", onTimeResetEvent)
    audioRef.current?.addEventListener("pause", onTimeResetEvent)
    audioRef.current?.addEventListener("timeupdate", onTimeUpdateEvent)
    audioRef.current?.addEventListener("ended", onFinishEvent)

    return () => {
      audioRef.current?.removeEventListener("loadeddata", onTimeResetEvent)
      audioRef.current?.removeEventListener("pause", onTimeResetEvent)
      audioRef.current?.removeEventListener("timeupdate", onTimeUpdateEvent)
      audioRef.current?.removeEventListener("ended", onFinishEvent)
    }
  }, [onTimeUpdate, onFinish])

  return <audio hidden key={src} src={src} ref={audioRef} />
}

export default Audio
