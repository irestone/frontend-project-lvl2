import { reduce, isObject } from 'lodash'

import {
  types,
  getType,
  getName,
  getValue,
  getValueBefore,
  getValueAfter,
  getChildren
} from '../diffBuilder'

const format = (nodes, depth) => {
  const stringify = createValueStringifier(depth)

  const props = nodes.map((node) => {
    const type = getType(node)
    const name = getName(node)

    switch (type) {
      case types.nested:
        return `    ${name}: ${format(getChildren(node), depth + 1).trim()}`
      case types.added:
        return `  + ${name}: ${stringify(getValue(node))}`
      case types.deleted:
        return `  - ${name}: ${stringify(getValue(node))}`
      case types.changed:
        return [
          `  - ${name}: ${stringify(getValueBefore(node))}`,
          `  + ${name}: ${stringify(getValueAfter(node))}`
        ]
      case types.unchanged:
        return `    ${name}: ${stringify(getValue(node))}`
      default:
        throw new Error(`Unknown node type "${type}"`)
    }
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

export default (diff) => format(diff, 0)
