import fs from 'fs'
import path from 'path'
import { union, isObject, has, isEqual } from 'lodash'

import { getParser } from './parsers'
import { getFormatter, defaultFormatter } from './formatters'

const genDiff = (filepath1, filepath2, format) => {
  const parse = getParser(path.extname(filepath1).slice(1))
  const obj1 = fs.readFileSync(filepath1, 'utf8') |> parse
  const obj2 = fs.readFileSync(filepath2, 'utf8') |> parse
  const stringify = format ? getFormatter(format) : defaultFormatter
  return buildDiff(obj1, obj2) |> stringify
}

const buildDiff = (before, after) => {
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
            ? createPlainNode(statuses.deleted, beforeValue)
            : !isEqual(beforeValue, afterValue)
              ? createPlainNode(statuses.changed, [beforeValue, afterValue])
              : createPlainNode(statuses.untouched, beforeValue)
      return { ...acc, [key]: node }
    }, {})
  }

  return traverse(before, after)
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//  Node

export const types = {
  nested: 'nested',
  plain: 'plain'
}

export const statuses = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  untouched: 'untouched'
}

export const createNestedNode = (children) => ({ type: types.nested, children })
export const createPlainNode = (status, value) => ({
  type: types.plain,
  status,
  value
})

export const isNested = (node) => node.type === types.nested
export const isPlain = (node) => node.type === types.plain

//  Node
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

export default genDiff

// ? (parseFile(filepath1), parseFile(filepath2)) |> buildDiff |> stringify
