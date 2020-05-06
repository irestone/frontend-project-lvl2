import { isObject, has } from 'lodash'

import { types } from '../diffBuilder'

const genIndentation = (depth) => ' '.repeat(4 * depth)

const format = (nodes, depth) => {
  const formattedNodes = nodes.map((node) => {
    const { type } = node
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
    const node = {
      type: types.unchanged,
      key,
      valueBefore: value,
      valueAfter: value
    }
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
    `${genIndentation(depth)}    ${node.key}:`,
    format(node.children, depth + 1)
  ].join(' '),
  [types.unchanged]: (node, depth) => [
    `${genIndentation(depth)}    ${node.key}:`,
    stringify(node.valueBefore, depth)
  ].join(' '),
  [types.deleted]: (node, depth) => [
    `${genIndentation(depth)}  - ${node.key}:`,
    stringify(node.valueBefore, depth)
  ].join(' '),
  [types.added]: (node, depth) => [
    `${genIndentation(depth)}  + ${node.key}:`,
    stringify(node.valueAfter, depth)
  ].join(' '),
  [types.changed]: (node, depth) => [
    [
      `${genIndentation(depth)}  - ${node.key}:`,
      stringify(node.valueBefore, depth)
    ].join(' '),
    [
      `${genIndentation(depth)}  + ${node.key}:`,
      stringify(node.valueAfter, depth)
    ].join(' ')
  ]
}

export default (diff) => format(diff, 0)
