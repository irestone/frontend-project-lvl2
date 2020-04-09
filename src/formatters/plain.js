import { isObject, isString, identity } from 'lodash'

import { types } from '../diffBuilder'

const format = (props, parentAncestry) => {
  return props.map(([status, key, value]) => {
    const ancestry = [...parentAncestry, key]
    const prefix = `Property '${ancestry.join('.')}' was`

    switch (status) {
      case types.nested:
        return format(value, ancestry)
      case types.added:
        return `${prefix} added with ${stringify(value)}`
      case types.deleted:
        return `${prefix} deleted`
      case types.changed:
        return `${prefix} changed from ${stringify(value[0])} to ${stringify(value[1])}`
      case types.unchanged:
        return null
      default:
        throw new Error(`Unknown status "${status}"`)
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
