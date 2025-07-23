import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useReplicant } from "@nodecg/react-hooks"
import { LineType, parse } from "clrc"

import type { Track, TrackData } from "../../types"

const DEFAULT_TRACK = {
  title: "Unknown Song",
  artist: "Unknown Artist",
  lyrics: undefined
}

const fetchLyrics = async (src?: string) => {
  if (!src) {
    throw new TypeError()
  }

  const response = await fetch(src)
  const plainLyrics = await response.text()

  return parse(plainLyrics)
}

export const useTrack = () => {
  const [track] = useReplicant<TrackData>("track")

  const { data: lines } = useQuery({
    enabled: !!track,
    queryKey: ["lyrics", track?.lyrics],
    queryFn: () => fetchLyrics(track?.lyrics)
  })

  return useMemo(() => {
    if (!track || !lines) {
      return null
    }

    return lines.reduce<Track>(
      (track, line) => {
        if (line.type === LineType.METADATA && line.key === "ti") {
          track.title = line.value
        }

        if (line.type === LineType.METADATA && line.key === "ar") {
          track.artist = line.value
        }

        if (line.type === LineType.LYRIC) {
          track.lyrics.push({
            ...line,
            content: line.content.trim()
          })
        }

        return track
      },
      {
        ...DEFAULT_TRACK,
        src: track.song,
        lyrics: []
      }
    )
  }, [track, lines])
}
