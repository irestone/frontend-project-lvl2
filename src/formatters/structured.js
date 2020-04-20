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

const genIndentation = (depth) => ' '.repeat(4 * depth)

const format = (nodes, depth) => {
  const formattedNodes = nodes.map((node) => {
    const type = getType(node)
    if (!has(nodeFormatters, type)) {
      throw new Error(`Node of type "${type}" is not supported`)
    }
    const formatNode = nodeFormatters[type]
    return formatNode(node, depth)
  })

  return [
    '{',
    ...formattedNodes,
    `${genIndentation(depth)}}`
  ].flat().join('\n')
}

const stringify = (value, depth) => {
  if (!isObject(value)) {
    return String(value)
  }

  const formatNode = nodeFormatters[types.unchanged]

  const stringifiedProps = Object.entries(value).map(([key, value]) => {
    const node = makeNode(
      types.unchanged,
      { key, valueBefore: value, valueAfter: value }
    )
    return formatNode(node, depth + 1)
  })

  return [
    '{',
    ...stringifiedProps,
    `${genIndentation(depth + 1)}}`
  ].join('\n')
}

const nodeFormatters = {
  [types.nested]: (node, depth) => [
    `${genIndentation(depth)}    ${getKey(node)}:`,
    format(getChildren(node), depth + 1)
  ].join(' '),
  [types.unchanged]: (node, depth) => [
    `${genIndentation(depth)}    ${getKey(node)}:`,
    stringify(getValueBefore(node), depth)
  ].join(' '),
  [types.deleted]: (node, depth) => [
    `${genIndentation(depth)}  - ${getKey(node)}:`,
    stringify(getValueBefore(node), depth)
  ].join(' '),
  [types.added]: (node, depth) => [
    `${genIndentation(depth)}  + ${getKey(node)}:`,
    stringify(getValueAfter(node), depth)
  ].join(' '),
  [types.changed]: (node, depth) => [
    [
      `${genIndentation(depth)}  - ${getKey(node)}:`,
      stringify(getValueBefore(node), depth)
    ].join(' '),
    [
      `${genIndentation(depth)}  + ${getKey(node)}:`,
      stringify(getValueAfter(node), depth)
    ].join(' ')
  ]
}

export default (diff) => format(diff, 0)
