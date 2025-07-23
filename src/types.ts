import type { LyricLine } from "clrc"

export interface TrackData {
  song: string
  lyrics: string
}

export interface Track {
  src: string
  title: string
  artist: string
  lyrics: Array<LyricLine>
}

export interface AssetFile {
  name: string
  url: string
}
