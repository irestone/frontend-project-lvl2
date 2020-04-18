import { isObject, isString, identity, has } from 'lodash'

import {
  types,
  getKey,
  getType,
  getChildren,
  getValueBefore,
  getValueAfter
} from '../diffBuilder'

const genPrefix = (ancestry) => `Property '${ancestry.join('.')}' was`

const format = (nodes, parentAncestry) => {
  return nodes.map((node) => {
    const type = getType(node)
    if (!has(nodeFormatters, type)) {
      throw new Error(`Node of type "${type}" is not supported`)
    }
    const ancestry = [...parentAncestry, getKey(node)]
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
  [types.nested]: (node, ancestry) => {
    return format(getChildren(node), ancestry)
  },
  [types.deleted]: (_, ancestry) => {
    return `${genPrefix(ancestry)} deleted`
  },
  [types.added]: (node, ancestry) => {
    return `${genPrefix(ancestry)} added with ${stringify(getValueAfter(node))}`
  },
  [types.unchanged]: () => {
    return null
  },
  [types.changed]: (node, ancestry) => {
    return [
      `${genPrefix(ancestry)} changed `,
      `from ${stringify(getValueBefore(node))} `,
      `to ${stringify(getValueAfter(node))}`
    ].join('')
  }
}

export default (diff) => format(diff, [])
