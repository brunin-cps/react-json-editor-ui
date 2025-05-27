import {
  AutoComplete,
  Button,
  Col,
  Input,
  InputNumber,
  Select,
  Space,
  Icons
} from '../ui'
const { PlusSquareOutlined } = Icons
import React, { CSSProperties, useRef } from 'react'
import { useContext, useState } from 'react'
import { ConfigContext } from '../store'
import { DataType, typeMap } from '../common'

const AddItem = (props: {
  uniqueKey: string
  sourceData: any
  deepLevel: number
}) => {
  const { setEditObject, editObject, optionsMap } = useContext(ConfigContext)
  const { uniqueKey, sourceData } = props
  const isArray = Array.isArray(sourceData)
  const keyRef = useRef<any>()
  const [templateData, setTemplateData] = useState<any>({})
  const [showIncreaseMap, setShowIncreaseMap] = useState<any>({})
  const onClickIncrease = (key: string, value: boolean) => {
    showIncreaseMap[key] = value
    templateData[key] = {}
    setTemplateData({
      ...templateData,
    })
    setShowIncreaseMap({
      ...showIncreaseMap,
    })
  }
  const changeInputKey = (uniqueKey: string, event: any) => {
    templateData[uniqueKey]['key'] = event.target.value
    setTemplateData({ ...templateData })
  }
  const changeInputValue = (uniqueKey: string, value: any) => {
    templateData[uniqueKey]['value'] = value
    setTemplateData({ ...templateData })
  }
  const onChangeTempType = (uniqueKey: string, type: DataType) => {
    templateData[uniqueKey]['type'] = type
    templateData[uniqueKey]['value'] = typeMap[type]
    setTemplateData({
      ...templateData,
    })
  }
  const onConfirmIncrease = (uniqueKey: any, sourceData: any) => {
    const { key: aKey, value } = JSON.parse(JSON.stringify((templateData[uniqueKey])))
    if (isArray) {
      sourceData.push(value)
    } else {
      if (value === undefined) sourceData[aKey] = ''
      else sourceData[aKey] = value
    }
    setEditObject({ ...editObject })
    onClickIncrease(uniqueKey, false)
  }

  const getTypeTemplate = (type: DataType) => {
    switch (type) {
      case DataType.STRING:
        const currentOptions =
          optionsMap?.[templateData[uniqueKey]?.['key']] ?? []
        return (
          <AutoComplete
            style={{ width: 100 }}
            size="small"
            options={currentOptions}
            onChange={value => changeInputValue(uniqueKey, value)}
            filterOption={(inputValue, option) =>
              `${option!.value}`
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        )
      case DataType.NUMBER:
        return (
          <InputNumber
            size="small"
            style={{ width: '100px' }}
            onChange={value => {
              changeInputValue(uniqueKey, +value)
            }}
          />
        )
      case DataType.BOOLEAN:
        return (
          <Select
            size="small"
            style={{ width: '100px' }}
            defaultValue={true}
            onChange={(value: boolean) => {
              changeInputValue(uniqueKey, value)
            }}
          >
            <Select.Option value={true} label="true">
              true
            </Select.Option>
            <Select.Option value={false} label="false">
              false
            </Select.Option>
          </Select>
        )
      default:
        return null
    }
  }

  const disabledStyle: CSSProperties = {
    pointerEvents: 'none',
    opacity: '0.5,'
  }

  return (
    <div className="addItem" key={uniqueKey}>
      {showIncreaseMap[uniqueKey] ? (
        <Space>
          {!isArray && (
            <div>
              <Input
                ref={keyRef}
                size="small"
                style={{ width: '100px' }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => changeInputKey(uniqueKey, event)}
              ></Input>
            </div>
          )}
          <div>
            <Select
              size="small"
              style={{ width: '100px' }}
              onChange={value => onChangeTempType(uniqueKey, value)}
              defaultValue={DataType.STRING}
            >
              {Object.values(DataType).map(item => (
                <Select.Option
                  value={item}
                  key={item}
                  style={{ width: '100px' }}
                >
                  {item}
                </Select.Option>
              ))}
            </Select>
          </div>
          {getTypeTemplate(templateData[uniqueKey]['type'] || DataType.STRING)}
          <div>
            <Space>
              <Button
                size="small"
                type="primary"
                onClick={() => onConfirmIncrease(uniqueKey, sourceData)}
                style={keyRef.current?.value ? {} : disabledStyle}
              >
                Confirm
              </Button>
              <Button
                size="small"
                onClick={() => onClickIncrease(uniqueKey, false)}
              >
                Cancel
              </Button>
            </Space>
          </div>
        </Space>
      ) : (
        <Col span={8}>
          <PlusSquareOutlined
            style={{ color: '#1E88E5' }}
            onClick={() => onClickIncrease(uniqueKey, true)}
          />
        </Col>
      )}
    </div>
  )
}
export default AddItem
