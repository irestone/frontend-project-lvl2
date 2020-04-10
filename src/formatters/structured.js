import { reduce, isObject, has } from 'lodash'

import {
  types,
  getType,
  getKey,
  getValueBefore,
  getValueAfter,
  getChildren
} from '../diffBuilder'

const format = (nodes, depth) => {
  const stringify = createValueStringifier(depth)

  const props = nodes.map((node) => {
    const type = getType(node)

    if (!has(nodeFormatters, type)) {
      throw new Error(`Node type "${type} is not supported`)
    }

    const formatNode = nodeFormatters[type]
    return formatNode({ node, stringify, depth })
  })

  const pad = ' '.repeat(4 * depth)

  return ['{', ...props, '}']
    .flat()
    .map((prop) => pad + prop)
    .join('\n')
}

const createValueStringifier = (depth) => (value) => {
  return isObject(value) ? objectToString(value, depth + 1) : value
}

const objectToString = (object, depth) => {
  const props = reduce(object, (acc, value, key) => {
    const propValue = isObject(value) ? objectToString(value, depth + 1) : value
    return [...acc, `    ${key}: ${propValue}`]
  }, [])

  const pad = ' '.repeat(4 * depth)
  return ['{', ...props, '}'].map((prop) => pad + prop).join('\n').trim()
}

const nodeFormatters = {
  [types.nested] ({ node, depth }) {
    return `    ${getKey(node)}: ${format(getChildren(node), depth + 1).trim()}`
  },
  [types.deleted] ({ node, stringify }) {
    return `  - ${getKey(node)}: ${stringify(getValueBefore(node))}`
  },
  [types.added] ({ node, stringify }) {
    return `  + ${getKey(node)}: ${stringify(getValueAfter(node))}`
  },
  [types.unchanged] ({ node, stringify }) {
    return `    ${getKey(node)}: ${stringify(getValueBefore(node))}`
  },
  [types.changed] ({ node, stringify }) {
    return [
      `  - ${getKey(node)}: ${stringify(getValueBefore(node))}`,
      `  + ${getKey(node)}: ${stringify(getValueAfter(node))}`
    ]
  }
}

export default (diff) => format(diff, 0)
