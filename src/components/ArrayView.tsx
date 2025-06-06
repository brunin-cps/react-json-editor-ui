import React, { useContext } from 'react'
import { getPlaceholder, isObject } from '../common'
import { ConfigContext } from '../store'
import AddItem from './AddItem'
import CollapsePart from './Collapse'
import ToolsView from './Tools'

type Props = {
  fieldValue: any[]
  fieldKey: string
  sourceData: any
  getValue: any
  deepLevel: number
  parentUniqueKey: string
}

function ArrayView(props: Props) {
  const { allowMap } = useContext(ConfigContext)
  return (
    <div className="array-content">
      <div style={{ marginTop: '10px' }}>
        {props.fieldValue.map((item: any, index: number) => {
          const uniqueKey = `${props.parentUniqueKey}-${index}`
          return (
            <div className="index-line" key={uniqueKey}>
              <span className="json-key">
                <span style={{ marginRight: '5px' }}>{index + 1}.</span>
              </span>
              <CollapsePart uniqueKey={uniqueKey} fieldValue={item} />
              {isObject(item) ? (
                <b className="mt15">{getPlaceholder(item)}</b>
              ) : null}
              {!allowMap[uniqueKey] && (
                <span className="json-value">
                  {props.getValue(
                    item,
                    index,
                    props.fieldValue,
                    props.deepLevel + 1,
                    uniqueKey
                  )}
                </span>
              )}
              {
                <ToolsView
                  deepLevel={props.deepLevel}
                  uniqueKey={uniqueKey}
                  fieldValue={item}
                  fieldKey={`${index}`}
                  sourceData={props.fieldValue}
                />
              }
            </div>
          )
        })}
      </div>
      <div>
        <AddItem
          key={props.parentUniqueKey}
          uniqueKey={props.parentUniqueKey}
          deepLevel={props.deepLevel}
          sourceData={props.fieldValue}
        />
      </div>
    </div>
  )
}
export default ArrayView
