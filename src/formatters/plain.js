import { reduce, isObject, isString } from 'lodash'

import { isDiff, statuses } from '../diffBuilder'

const traverse = (parentNode, parentAncestry) => {
  return reduce(parentNode.children, (acc, node, name) => {
    const ancestry = [...parentAncestry, name]

    if (isDiff(node)) {
      return [...acc, ...traverse(node, ancestry)]
    }

    const { value, status } = node

    if (!status) {
      return acc
    }

    const prop = `Property '${ancestry.join('.')}' was`

    switch (status) {
      case statuses.added:
        return [...acc, `${prop} added with ${v(value)}`]
      case statuses.deleted:
        return [...acc, `${prop} deleted`]
      case statuses.changed:
        return [...acc, `${prop} changed from ${v(value[0])} to ${v(value[1])}`]
      default:
        throw new Error(`Unknown diff node status "${status}"`)
    }
  }, [])
}

const v = (value) => {
  return isObject(value)
    ? '[complex value]'
    : isString(value)
      ? `'${value}'`
      : value
}

export default (diff) => traverse(diff, []).join('\n')
