import { isObject, isString, identity, has } from 'lodash'

import { types } from '../diffBuilder'

const genPrefix = (ancestry) => `Property '${ancestry.join('.')}' was`

const format = (nodes, parentAncestry) => {
  return nodes.map((node) => {
    const { type, key } = node
    if (!has(nodeFormatters, type)) {
      throw new Error(`Node of type "${type}" is not supported`)
    }
    const ancestry = [...parentAncestry, key]
    const formatNode = nodeFormatters[type]
    return formatNode(node, ancestry)
  }).filter(identity).join('\n')
}

const stringify = (value) => {
  if (isObject(value)) {
    return '[complex value]'
  }

  if (isString(value)) {
    return `'${value}'`
  }

  return value
}

const nodeFormatters = {
  [types.nested]: (node, ancestry) => format(node.children, ancestry),
  [types.deleted]: (_, ancestry) => `${genPrefix(ancestry)} deleted`,
  [types.added]: (node, ancestry) => [
    `${genPrefix(ancestry)} added`,
    `with ${stringify(node.valueAfter)}`
  ].join(' '),
  [types.changed]: (node, ancestry) => [
    `${genPrefix(ancestry)} changed`,
    `from ${stringify(node.valueBefore)}`,
    `to ${stringify(node.valueAfter)}`
  ].join(' '),
  [types.unchanged]: () => null
}

export default (diff) => format(diff, [])
