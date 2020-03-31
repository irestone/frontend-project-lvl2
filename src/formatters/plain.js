import { reduce, isObject, isString } from 'lodash'
import { isNested, statuses } from '..'

export default (diff) => {
  const v = (value) => isObject(value)
    ? '[complex value]'
    : isString(value)
      ? `'${value}'`
      : value

  const traverse = (parentAncestry, parentNode) => {
    const lines = reduce(parentNode, (acc, node, name) => {
      const ancestry = [...parentAncestry, name]

      if (isNested(node)) {
        return [...acc, traverse(ancestry, node.children)]
      }

      const { status, value } = node

      if (status === statuses.untouched) {
        return acc
      }

      const property = `Property '${ancestry.join('.')}' was `
      let effect

      switch (status) {
        case statuses.added:
          effect = `added with ${v(value)}`
          break
        case statuses.deleted:
          effect = 'deleted'
          break
        case statuses.changed:
          effect = `changed from ${v(value[0])} to ${v(value[1])}`
          break
        default:
          throw new Error(`Unknown node status ${status}`)
      }

      const line = property + effect

      return [...acc, line]
    }, [])

    return lines.join('\n')
  }

  return traverse([], diff)
}
