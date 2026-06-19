import type { LyricLine } from "clrc"

export interface TrackData {
  song: string
  lyrics: string
}

export interface TrackVoice {
  name: string
  vocalist?: Vocalist
}

export interface TrackLyricLinePart {
  index: number
  content: string
  vocalist?: string
  /** Whether or not this part has the same vocalist as the previous part */
  continuation?: boolean
}

export interface TrackLyricLine extends LyricLine {
  parts: TrackLyricLinePart[]
  duration: number | null
  /* which line of the lyrics this is; lineNumber is the original LRC file's line number */
  lyricLineNumber: number
}

export interface Track {
  src: string
  title: string
  artist: string
  voices: TrackVoice[]
  offset: number
  lyrics: Array<TrackLyricLine>
}

export interface AssetFile {
  name: string
  url: string
}

export interface Vocalist {
  name: string
  colour?: string
}
