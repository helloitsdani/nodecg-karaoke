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
  continuation?: boolean
}

export interface TrackLyricLine extends LyricLine {
  parts: TrackLyricLinePart[]
}

export interface Track {
  src: string
  title: string
  artist: string
  voices: TrackVoice[]
  lyrics: Array<TrackLyricLine>
}

export interface AssetFile {
  name: string
  url: string
}

export interface Vocalist {
  name: string
  colour: string
}
