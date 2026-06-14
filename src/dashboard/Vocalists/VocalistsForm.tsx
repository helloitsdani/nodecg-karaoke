import {
  Button,
  Form,
  Input,
  ColorPicker,
  Flex,
  type GetProp,
  type ColorPickerProps
} from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"

import type { Vocalist } from "../../types"
import { useEffect } from "react"

type Color = Extract<
  GetProp<ColorPickerProps, "value">,
  string | { cleared: any }
>

interface VocalistFormFields {
  vocalists: {
    name?: string
    colour?: Color
  }[]
}

interface VocalistsFormProps {
  vocalists?: Vocalist[]
  onUpdateVocalists: (vocalists: Vocalist[]) => void
}

const VocalistsForm = ({
  vocalists,
  onUpdateVocalists
}: VocalistsFormProps) => {
  const [vocalistsForm] = Form.useForm<VocalistFormFields>()

  const onVocalistsChange = (
    _: Partial<VocalistFormFields>,
    updatedState: VocalistFormFields
  ) => {
    onUpdateVocalists(
      updatedState.vocalists?.map((vocalist) => {
        const name = vocalist?.name ?? ""
        const baseColour = vocalist?.colour ?? "#FFFFFF"
        const colour =
          typeof baseColour === "string" ? baseColour : baseColour.toHexString()

        return {
          name,
          colour
        }
      })
    )
  }

  useEffect(() => {
    if (!vocalists) {
      return
    }

    vocalistsForm.setFieldsValue({
      vocalists
    })
  }, [vocalists, vocalistsForm])

  return (
    <Form
      name="vocalistsForm"
      form={vocalistsForm}
      onValuesChange={onVocalistsChange}
      initialValues={{ vocalists }}
    >
      <Form.List name="vocalists">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Flex
                key={field.name}
                gap="small"
                align="center"
                style={{ marginBottom: "20px" }}
              >
                <Form.Item {...field} name={[field.name, "colour"]} noStyle>
                  <ColorPicker
                    mode="single"
                    defaultValue="#FFFFFF"
                    disabledAlpha
                    disabledFormat
                  />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, "name"]}
                  style={{ flexGrow: 1 }}
                  noStyle
                >
                  <Input defaultValue="" style={{ width: "100%" }} />
                </Form.Item>

                <DeleteOutlined size={24} onClick={() => remove(field.name)} />
              </Flex>
            ))}

            <Form.Item>
              <Button
                color="pink"
                variant="solid"
                size="large"
                onClick={() => add()}
                style={{ width: "100%" }}
                icon={<PlusOutlined />}
              >
                Add vocalist
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  )
}

export default VocalistsForm
