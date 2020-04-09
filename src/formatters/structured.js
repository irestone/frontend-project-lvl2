import { reduce, isObject } from 'lodash'

import { types } from '../diffBuilder'

const format = (props, depth) => {
  const stringify = createValueStringifier(depth)

  const formattedProps = props.map(([status, key, value]) => {
    switch (status) {
      case types.nested:
        return `    ${key}: ${format(value, depth + 1)}`
      case types.added:
        return `  + ${key}: ${stringify(value)}`
      case types.deleted:
        return `  - ${key}: ${stringify(value)}`
      case types.changed:
        return [`  - ${key}: ${stringify(value[0])}`, `  + ${key}: ${stringify(value[1])}`]
      case types.unchanged:
        return `    ${key}: ${stringify(value)}`
      default:
        throw new Error(`Unknown status "${status}"`)
    }
  })

  const pad = ' '.repeat(4 * depth)

  return ['{', ...formattedProps, '}']
    .flat()
    .map((prop) => pad + prop)
    .join('\n')
    .trim()
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

export default (diff) => format(diff, 0)
