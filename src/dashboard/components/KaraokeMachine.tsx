import { useCallback } from "react"
import { Button, Space } from "antd"
import { CloseCircleFilled, PlayCircleFilled } from "@ant-design/icons"
import { useReplicant } from "@nodecg/react-hooks"

import type { Track } from "../../types"

import TrackSelector from "./TrackSelector"

const KaraokeMachine = () => {
  const [track, setTrack] = useReplicant<Track>("track")

  const onStart = useCallback(() => {
    NodeCG.sendMessageToBundle("track.start", "nodecg-karaoke")
  }, [])

  const onStop = useCallback(() => {
    NodeCG.sendMessageToBundle("track.stop", "nodecg-karaoke")
  }, [])

  return (
    <div>
      <TrackSelector track={track} onUpdateTrack={setTrack} />

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
