import { Form, Select } from "antd"
import { useCallback, useEffect, useMemo } from "react"
import { useReplicant } from "@nodecg/react-hooks"

import type { Track, AssetFile } from "../../types"

interface TrackSelectorProps {
  track?: Track
  onUpdateTrack: (track: Track) => void
}

interface TrackSelectorFields {
  song: string
  lyrics: string
}

const TrackSelector = ({ track, onUpdateTrack }: TrackSelectorProps) => {
  const [songs] = useReplicant<AssetFile[]>("assets:songs")
  const [lyrics] = useReplicant<AssetFile[]>("assets:lyrics")

  const [trackSelectorForm] = Form.useForm<TrackSelectorFields>()
  const currentSongURL = trackSelectorForm.getFieldValue("song")

  const songOptions = useMemo(() => {
    if (!songs) {
      return []
    }

    const sortedSongs = songs
      .map((song) => ({ label: song.name, value: song.url }))
      .sort((a, b) => a.label.localeCompare(b.label))

    const songsByArtist = Map.groupBy(
      sortedSongs,
      (song) => song.label.split(" - ")[0]
    )

    return Array.from(songsByArtist.entries()).map(([title, songs]) => ({
      label: <span>{title}</span>,
      title,
      options: songs
    }))
  }, [songs])

  const lyricOptions = useMemo(() => {
    const currentSong = songs?.find((song) => currentSongURL === song.url)

    if (!lyrics || !currentSong) {
      return []
    }

    return lyrics
      .filter((lyric) => lyric.name.startsWith(currentSong.name))
      .map((lyric) => ({ label: lyric.name, value: lyric.url }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [songs, lyrics, currentSongURL])

  const onValuesChange = useCallback(
    (changedValues: Partial<TrackSelectorFields>) => {
      if (changedValues.song) {
        const songAsset = songs?.find((song) => changedValues.song === song.url)

        const matchingLyrics = lyrics?.find(
          (lyric) => songAsset?.name === lyric.name
        )

        if (matchingLyrics) {
          trackSelectorForm.setFieldValue("lyrics", matchingLyrics.url)
        }
      }

      trackSelectorForm.submit()
    },
    [songs, lyrics, trackSelectorForm]
  )

  useEffect(() => {
    if (!track) {
      return
    }

    trackSelectorForm.setFieldsValue(track)
  }, [track, trackSelectorForm])

  return (
    <Form
      name="karaoke"
      initialValues={track}
      form={trackSelectorForm}
      layout="horizontal"
      onValuesChange={onValuesChange}
      onFinish={onUpdateTrack}
    >
      <Form.Item label="Song" name="song" layout="horizontal">
        <Select
          placeholder="Select a song..."
          showSearch
          optionFilterProp="label"
          options={songOptions}
        />
      </Form.Item>

      <Form.Item label="Lyrics" name="lyrics">
        <Select
          placeholder="Select lyrics..."
          showSearch
          optionFilterProp="label"
          options={lyricOptions}
        />
      </Form.Item>
    </Form>
  )
}

export default TrackSelector
