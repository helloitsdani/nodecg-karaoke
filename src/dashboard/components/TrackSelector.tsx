import { Form, Select } from "antd"
import { useReplicant } from "@nodecg/react-hooks"

import type { Track, AssetFile } from "../types"
import { useCallback, useMemo } from "react"

interface TrackSelectorProps {
  onUpdateTrack: (track: Track) => void
}

interface TrackSelectorFields {
  song: string
  lyrics: string
}

const TrackSelector = ({ onUpdateTrack }: TrackSelectorProps) => {
  const [songs] = useReplicant<AssetFile[]>("assets:songs")
  const [lyrics] = useReplicant<AssetFile[]>("assets:lyrics")
  const [trackSelectorForm] = Form.useForm<TrackSelectorFields>()

  const songOptions = useMemo(
    () => songs?.map((song) => ({ label: song.name, value: song.url })),
    [songs]
  )

  const lyricOptions = useMemo(
    () => lyrics?.map((lyric) => ({ label: lyric.name, value: lyric.url })),
    [lyrics]
  )

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

  return (
    <Form
      name="karaoke"
      form={trackSelectorForm}
      layout="horizontal"
      onValuesChange={onValuesChange}
      onFinish={onUpdateTrack}
    >
      <Form.Item label="Song" name="song">
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
