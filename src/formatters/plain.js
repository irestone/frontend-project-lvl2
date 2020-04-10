import { isObject, isString, identity } from 'lodash'

import {
  types,
  getName,
  getType,
  getChildren,
  getValue,
  getValueBefore,
  getValueAfter
} from '../diffBuilder'

const format = (nodes, parentAncestry) => {
  return nodes.map((node) => {
    const ancestry = [...parentAncestry, getName(node)]
    const prefix = `Property '${ancestry.join('.')}' was`

    const type = getType(node)

    switch (type) {
      case types.nested:
        return format(getChildren(node), ancestry)
      case types.added:
        return `${prefix} added with ${stringify(getValue(node))}`
      case types.deleted:
        return `${prefix} deleted`
      case types.changed:
        return `${prefix} changed from ${stringify(getValueBefore(node))} to ${stringify(getValueAfter(node))}`
      case types.unchanged:
        return null
      default:
        throw new Error(`Unknown node type "${type}"`)
    }
  }).filter(identity).join('\n')
}

const stringify = (value) => {
  return isObject(value)
    ? '[complex value]'
    : isString(value)
      ? `'${value}'`
      : value
}

export default (diff) => format(diff, [])
