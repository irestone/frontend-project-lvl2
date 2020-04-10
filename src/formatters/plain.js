import { isObject, isString, identity, has } from 'lodash'

import {
  types,
  getKey,
  getType,
  getChildren,
  getValueBefore,
  getValueAfter
} from '../diffBuilder'

const format = (nodes, parentAncestry) => {
  return nodes.map((node) => {
    const type = getType(node)

    if (!has(nodeFormatters, type)) {
      throw new Error(`Node type "${type} is not supported`)
    }

    const ancestry = [...parentAncestry, getKey(node)]
    const prefix = `Property '${ancestry.join('.')}' was`
    const formatNode = nodeFormatters[type]
    return formatNode({ node, ancestry, prefix })
  }).filter(identity).join('\n')
}

const stringify = (value) => {
  return isObject(value)
    ? '[complex value]'
    : isString(value)
      ? `'${value}'`
      : value
}

const nodeFormatters = {
  [types.nested] ({ node, ancestry }) {
    return format(getChildren(node), ancestry)
  },
  [types.deleted] ({ prefix }) {
    return `${prefix} deleted`
  },
  [types.added] ({ node, prefix }) {
    return `${prefix} added with ${stringify(getValueAfter(node))}`
  },
  [types.unchanged] () {
    return null
  },
  [types.changed] ({ node, prefix }) {
    return [
      `${prefix} changed `,
      `from ${stringify(getValueBefore(node))} `,
      `to ${stringify(getValueAfter(node))}`
    ].join('')
  }
}

export default (diff) => format(diff, [])
