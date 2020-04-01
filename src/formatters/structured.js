import { reduce, isObject } from 'lodash'

import { isDiff, statuses } from '../diffBuilder'

const traverse = (parentNode, depth) => {
  const v = createValueFormatter(depth)

  const props = reduce(parentNode.children, (acc, node, name) => {
    if (isDiff(node)) {
      return [...acc, `    ${name}: ${traverse(node, depth + 1)}`]
    }

    const { status, value } = node

    if (!status) {
      return [...acc, `    ${name}: ${v(value)}`]
    }

    switch (status) {
      case statuses.added:
        return [...acc, `  + ${name}: ${v(value)}`]
      case statuses.deleted:
        return [...acc, `  - ${name}: ${v(value)}`]
      case statuses.changed:
        return [
          ...acc,
          `  - ${name}: ${v(value[0])}`,
          `  + ${name}: ${v(value[1])}`
        ]
      default:
        throw new Error(`Unknown diff node status "${node.status}"`)
    }
  }, [])

  const pad = ' '.repeat(4 * depth)
  return ['{', ...props, '}'].map((prop) => pad + prop).join('\n').trim()
}

const createValueFormatter = (depth) => (value) => {
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

export default (diff) => traverse(diff, 0)
