import { Flex, Form, Select } from "antd"
import { useEffect, useMemo } from "react"
import { useReplicant } from "@nodecg/react-hooks"

import type { TrackData, Vocalist } from "../../types"
import { useTrack } from "../../common/hooks/useTrack"

interface TrackSelectorProps {
  trackData?: TrackData
  vocalists?: Vocalist[]
  trackVoices?: string[]
  onUpdateTrackVoices: (trackVoices: string[]) => void
}

interface TrackVoicesFields {
  trackVoices: string[]
}

const TrackVoices = ({
  trackData,
  trackVoices,
  onUpdateTrackVoices
}: TrackSelectorProps) => {
  const [vocalists] = useReplicant<Vocalist[]>("vocalists")
  const track = useTrack(trackData, trackVoices, vocalists)

  const [trackVoicesForm] = Form.useForm<TrackVoicesFields>()

  const vocalistOptions = useMemo(() => {
    return (
      vocalists?.map((vocalist) => ({
        value: vocalist.name
      })) ?? []
    )
  }, [vocalists])

  const onTrackVoicesChange = (
    _: Partial<TrackVoicesFields>,
    updatedState: TrackVoicesFields
  ) => {
    onUpdateTrackVoices(updatedState.trackVoices)
  }

  useEffect(() => {
    if (!track) {
      return
    }

    trackVoicesForm.setFieldsValue({
      trackVoices: track.voices.map((_, idx) => trackVoices?.[idx] ?? "")
    })
  }, [track, trackVoices, trackVoicesForm])

  if (!track || track.voices.length <= 1) {
    return null
  }

  return (
    <Form
      name="trackVoicesForm"
      form={trackVoicesForm}
      onValuesChange={onTrackVoicesChange}
      initialValues={{ trackVoices }}
    >
      <Form.List name="trackVoices">
        {(fields) => (
          <Flex gap="small" align="center">
            {fields.map((field, idx) =>
              idx > 0 ? (
                <Flex
                  key={field.name}
                  gap="small"
                  style={{
                    flexGrow: 1,
                    width: "25%"
                  }}
                >
                  <Form.Item
                    {...field}
                    style={{ width: "100%" }}
                    label={`Voice ${idx}: ${track.voices[idx]?.name}`}
                  >
                    <Select
                      options={vocalistOptions}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Flex>
              ) : null
            )}
          </Flex>
        )}
      </Form.List>
    </Form>
  )
}

export default TrackVoices
