import { union, isObject, has, isEqual, reduce } from 'lodash'

import { parseFile } from './parser'

const genDiff = (filepath1, filepath2) => {
  return buildDiff(parseFile(filepath1), parseFile(filepath2)) |> stringify
}

export const buildDiff = (before, after) => {
  const traverse = (before, after) => {
    const keys = union(Object.keys(before), Object.keys(after))
    return keys.reduce((acc, key) => {
      const beforeValue = before[key]
      const afterValue = after[key]
      const node = isObject(beforeValue) && isObject(afterValue)
        ? traverse(beforeValue, afterValue) |> createNestedNode
        : !has(before, key)
          ? createPlainNode(statuses.added, afterValue)
          : !has(after, key)
            ? createPlainNode(statuses.removed, beforeValue)
            : !isEqual(beforeValue, afterValue)
              ? createPlainNode(statuses.modified, [beforeValue, afterValue])
              : createPlainNode(statuses.unchanged, beforeValue)
      return { ...acc, [key]: node }
    }, {})
  }

  return traverse(before, after)
}

export const stringify = (diff) => {
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
    [statuses.removed]: '-',
    [statuses.unchanged]: ' '
  }

  const traverse = (tree, depth) => {
    const props = reduce(tree, (acc, node, key) => {
      if (isNestedNode(node)) {
        return [...acc, `    ${key}: ${traverse(node.children, depth + 1)}`]
      }

      const v = cv(depth + 1)
      const { status, value } = node

      if (status === 'modified') {
        return [
          ...acc,
          `  ${statusSigns.removed} ${key}: ${v(value[0])}`,
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//  Node

const types = {
  nested: 'nested',
  plain: 'plain'
}

const statuses = {
  added: 'added',
  removed: 'removed',
  modified: 'modified',
  unchanged: 'unchanged'
}

const createNestedNode = (children) => ({ type: types.nested, children })
const createPlainNode = (status, value) => ({ type: types.plain, status, value })

const isNestedNode = (node) => node.type === types.nested
// const isPlainNode = (node) => node.type === types.plain
// const isAdded = (node) => node.status === statuses.added
// const isRemoved = (node) => node.status === statuses.removed
// const isModified = (node) => node.status === statuses.modified
// const isUnchanged = (node) => node.status === statuses.unchanged

//  Node
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

export default genDiff

// ? (parseFile(filepath1), parseFile(filepath2)) |> buildDiff |> stringify
