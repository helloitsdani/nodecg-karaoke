import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useReplicant } from "@nodecg/react-hooks"
import { LineType, parse } from "clrc"

import type { Track, TrackData, Vocalist } from "../../types"

const DEFAULT_TRACK = {
  title: "Unknown Song",
  artist: "Unknown Artist",
  voices: undefined,
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

export const useTrack = (
  track?: TrackData,
  trackVoices?: string[],
  vocalists?: Vocalist[]
) => {
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

        if (line.type === LineType.METADATA && line.key === "vo") {
          const [voNumber, voName] = line.value.split(":")
          const idx = Number(voNumber)
          const trackVocalist = trackVoices?.[idx]
          const vocalist = vocalists?.find(
            (vocalist) => vocalist.name === trackVocalist
          )

          track.voices[idx] = {
            name: voName,
            vocalist: vocalist ? { ...vocalist } : undefined
          }
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
        lyrics: [],
        voices: []
      }
    )
  }, [track, trackVoices, vocalists, lines])
}

export const useTrackFromReplicant = () => {
  const [track] = useReplicant<TrackData>("track.data")
  const [trackVoices] = useReplicant<string[]>("track.voices")
  const [vocalists] = useReplicant<Vocalist[]>("vocalists")
  return useTrack(track as any, trackVoices as any, vocalists as any)
}
