import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useReplicant } from "@nodecg/react-hooks"
import { LineType, parse } from "clrc"

import type {
  Track,
  TrackData,
  TrackLyricLinePart,
  Vocalist
} from "../../types"

const DEFAULT_TRACK = {
  title: "Unknown Song",
  artist: "Unknown Artist",
  voices: undefined,
  lyrics: undefined
}

const VOCALIST_TAG_REGEX = /(?:{vo:(-?\d+)?})?(.+?)(?={|$)/g

const fetchLyrics = async (src?: string) => {
  if (!src) {
    throw new TypeError()
  }

  const response = await fetch(src)
  const plainLyrics = await response.text()

  return parse(plainLyrics)
}

export const useTrack = (
  trackData?: TrackData,
  trackVoices?: string[],
  vocalists?: Vocalist[]
) => {
  const { data: lines } = useQuery({
    enabled: !!trackData,
    queryKey: ["lyrics", trackData?.lyrics],
    queryFn: () => fetchLyrics(trackData?.lyrics)
  })

  return useMemo(() => {
    if (!trackData || !lines) {
      return null
    }

    /**
     * Used to track vocalists between lines, so we can determine when
     * one part continues from another
     */
    let previousPartVocalist: string | undefined

    const track = lines.reduce<Track>(
      (track, line) => {
        if (line.type === LineType.METADATA && line.key === "ti") {
          track.title = line.value
        }

        if (line.type === LineType.METADATA && line.key === "ar") {
          track.artist = line.value
        }

        if (line.type === LineType.METADATA && line.key === "offset") {
          track.offset = Number(line.value)
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
          const content = line.content.trim()
          const matches = content.matchAll(VOCALIST_TAG_REGEX)
          const parts: TrackLyricLinePart[] = []

          matches.forEach(([_, vocalist, content], idx) => {
            parts.push({
              index: idx,
              content,
              vocalist,
              continuation: vocalist === previousPartVocalist
            })
            previousPartVocalist = vocalist
          })

          if (parts.length === 0) {
            parts.push({
              index: 0,
              content
            })
            previousPartVocalist = undefined
          }

          track.lyrics.push({
            ...line,
            content,
            parts,
            duration: null,
            lyricLineNumber: track.lyrics.length + 1
          })
        }

        return track
      },
      {
        ...DEFAULT_TRACK,
        src: trackData.song,
        lyrics: [],
        voices: [],
        offset: 0
      }
    )

    track.lyrics.forEach((line, lineIdx) => {
      const nextLine = track.lyrics[lineIdx + 1]
      let duration = null

      if (nextLine) {
        duration = nextLine.startMillisecond - line.startMillisecond
      }

      line.duration = duration
    })

    return track
  }, [trackData, trackVoices, vocalists, lines])
}

export const useTrackFromReplicant = () => {
  const [track] = useReplicant<TrackData>("track.data")
  const [trackVoices] = useReplicant<string[]>("track.voices")
  const [vocalists] = useReplicant<Vocalist[]>("vocalists")
  return useTrack(track as any, trackVoices as any, vocalists as any)
}
