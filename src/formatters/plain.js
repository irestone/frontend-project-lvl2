import { isObject, isString, identity } from 'lodash'

import { types } from '../diffBuilder'

const format = (nodes, parentAncestry) => {
  return nodes.map(({ type, name, value, children }) => {
    const ancestry = [...parentAncestry, name]
    const prefix = `Property '${ancestry.join('.')}' was`

    switch (type) {
      case types.nested:
        return format(children, ancestry)
      case types.added:
        return `${prefix} added with ${stringify(value)}`
      case types.deleted:
        return `${prefix} deleted`
      case types.changed:
        return `${prefix} changed from ${stringify(value.before)} to ${stringify(value.after)}`
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
