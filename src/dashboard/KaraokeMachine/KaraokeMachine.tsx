import { useCallback } from "react"
import { Button, Space } from "antd"
import { CloseCircleFilled, PlayCircleFilled } from "@ant-design/icons"
import { useReplicant } from "@nodecg/react-hooks"

import type { TrackData } from "../../types"

import TrackSelector from "./TrackSelector"
import TrackVoices from "./TrackVoices"

const KaraokeMachine = () => {
  const [trackData, setTrackData] = useReplicant<TrackData>("track.data")
  const [trackVoices, setTrackVoices] = useReplicant<string[]>("track.voices")

  const onStart = useCallback(() => {
    NodeCG.sendMessageToBundle("track.start", "nodecg-karaoke")
  }, [])

  const onStop = useCallback(() => {
    NodeCG.sendMessageToBundle("track.stop", "nodecg-karaoke")
  }, [])

  const onUpdateTrackData = useCallback(
    (newTrackData: TrackData) => {
      setTrackData(newTrackData)
      setTrackVoices([])
    },
    [setTrackData, setTrackVoices]
  )

  return (
    <div>
      <TrackSelector trackData={trackData} onUpdateTrack={onUpdateTrackData} />
      <TrackVoices
        trackData={trackData}
        trackVoices={trackVoices}
        onUpdateTrackVoices={setTrackVoices}
      />

      <Space size="middle">
        <Button
          color="pink"
          variant="solid"
          size="large"
          onClick={onStart}
          icon={<PlayCircleFilled />}
        >
          Play
        </Button>

        <Button
          color="pink"
          variant="solid"
          size="large"
          onClick={onStop}
          icon={<CloseCircleFilled />}
        >
          Stop
        </Button>
      </Space>
    </div>
  )
}

export default KaraokeMachine
