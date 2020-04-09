import { reduce, isObject } from 'lodash'

import { types } from '../diffBuilder'

const format = (nodes, depth) => {
  const stringify = createValueStringifier(depth)

  const props = nodes.map(({ type, name, value, children }) => {
    switch (type) {
      case types.nested:
        return `    ${name}: ${format(children, depth + 1)}`
      case types.added:
        return `  + ${name}: ${stringify(value)}`
      case types.deleted:
        return `  - ${name}: ${stringify(value)}`
      case types.changed:
        return [
          `  - ${name}: ${stringify(value.before)}`,
          `  + ${name}: ${stringify(value.after)}`
        ]
      case types.unchanged:
        return `    ${name}: ${stringify(value)}`
      default:
        throw new Error(`Unknown node type "${type}"`)
    }
  })

  const pad = ' '.repeat(4 * depth)

  return ['{', ...props, '}']
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
