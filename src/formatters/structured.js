import { isObject, has } from 'lodash'

import {
  types,
  makeNode,
  getType,
  getKey,
  getValueBefore,
  getValueAfter,
  getChildren
} from '../diffBuilder'

const genPad = (depth) => ' '.repeat(4 * depth)

const format = (nodes, depth) => {
  const props = nodes.map((node) => {
    const type = getType(node)
    if (!has(nodeFormatters, type)) {
      throw new Error(`Node of type "${type}" is not supported`)
    }
    const formatNode = nodeFormatters[type]
    return formatNode(node, depth)
  })

  return [
    '{',
    ...props,
    `${genPad(depth)}}`
  ].flat().join('\n')
}

const stringify = (value, depth) => {
  if (!isObject(value)) {
    return String(value)
  }

  const formatNode = nodeFormatters[types.unchanged]

  const props = Object.entries(value).map(([key, value]) => {
    const node = makeNode(
      types.unchanged,
      { key, valueBefore: value, valueAfter: value }
    )
    return formatNode(node, depth + 1)
  })

  return [
    '{',
    ...props,
    `${genPad(depth + 1)}}`
  ].join('\n')
}

const nodeFormatters = {
  [types.nested]: (node, depth) => {
    return `${genPad(depth)}    ${getKey(node)}: ${format(getChildren(node), depth + 1)}`
  },
  [types.unchanged]: (node, depth) => {
    return `${genPad(depth)}    ${getKey(node)}: ${stringify(getValueBefore(node), depth)}`
  },
  [types.deleted]: (node, depth) => {
    return `${genPad(depth)}  - ${getKey(node)}: ${stringify(getValueBefore(node), depth)}`
  },
  [types.added]: (node, depth) => {
    return `${genPad(depth)}  + ${getKey(node)}: ${stringify(getValueAfter(node), depth)}`
  },
  [types.changed]: (node, depth) => {
    return [
      `${genPad(depth)}  - ${getKey(node)}: ${stringify(getValueBefore(node), depth)}`,
      `${genPad(depth)}  + ${getKey(node)}: ${stringify(getValueAfter(node), depth)}`
    ]
  }
}

export default (diff) => format(diff, 0)
