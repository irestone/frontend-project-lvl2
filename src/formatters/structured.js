import { reduce, isObject } from 'lodash'
import { statuses, isNested } from '..'

export default (diff) => {
  const objToStr = (obj, depth) => {
    const props = reduce(obj, (acc, value, key) => {
      const propValue = isObject(value) ? objToStr(value, depth + 1) : value
      const prop = `    ${key}: ${propValue}`
      return [...acc, prop]
    }, [])
    const pad = ' '.repeat(4 * depth)
    return ['{', ...props, '}'].map((line) => pad + line).join('\n').trim()
  }

  const cv = (depth) => (val) => isObject(val) ? objToStr(val, depth) : val

  const statusSigns = {
    [statuses.added]: '+',
    [statuses.deleted]: '-',
    [statuses.untouched]: ' '
  }

  const traverse = (tree, depth) => {
    const props = reduce(tree, (acc, node, key) => {
      if (isNested(node)) {
        return [...acc, `    ${key}: ${traverse(node.children, depth + 1)}`]
      }

      const v = cv(depth + 1)
      const { status, value } = node

      if (status === statuses.changed) {
        return [
          ...acc,
          `  ${statusSigns.deleted} ${key}: ${v(value[0])}`,
          `  ${statusSigns.added} ${key}: ${v(value[1])}`
        ]
      }

      return [...acc, `  ${statusSigns[status]} ${key}: ${v(value)}`]
    }, [])

    const pad = ' '.repeat(4 * depth)
    return ['{', ...props, '}'].map((line) => pad + line).join('\n').trim()
  }

  return traverse(diff, 0)
}
