import { Button, Space } from "antd"
import { CloseCircleFilled, PlayCircleFilled } from "@ant-design/icons"

import TrackSelector from "./TrackSelector"
import { useReplicant } from "@nodecg/react-hooks"
import type { Track } from "../types"
import { useCallback } from "react"

const Player = () => {
  const [track, setTrack] = useReplicant<Track>("track")

  console.log(track)

  const onStart = useCallback(() => {
    NodeCG.sendMessageToBundle("track.start", "nodecg-karaoke")
  }, [])

  const onStop = useCallback(() => {
    NodeCG.sendMessageToBundle("track.stop", "nodecg-karaoke")
  }, [])

  return (
    <div>
      <TrackSelector onUpdateTrack={setTrack} />

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
          Pause
        </Button>
      </Space>
    </div>
  )
}

export default Player
