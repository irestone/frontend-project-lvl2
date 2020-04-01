import fs from 'fs'
import path from 'path'
import { union, isObject, has, isEqual } from 'lodash'

import { getParser } from './parsers'
import { getFormatter, defaultFormatter } from './formatters'

const genDiff = (filepath1, filepath2, format) => {
  const parse = getParser(path.extname(filepath1).slice(1))
  const before = fs.readFileSync(filepath1, 'utf8') |> parse
  const after = fs.readFileSync(filepath2, 'utf8') |> parse
  const stringify = format ? getFormatter(format) : defaultFormatter
  return buildDiff(before, after) |> stringify
}

// =====================================
//  DIFF BUILDING
// =====================================

const buildDiff = (before, after) => ({
  type: types.diff,
  children: traverse(before, after)
})

const buildProperty = (value, status) => ({
  type: types.prop,
  value,
  status
})

const traverse = (before, after) => {
  const keys = union(Object.keys(before), Object.keys(after))
  return keys.reduce((acc, key) => {
    const valueBefore = before[key]
    const valueAfter = after[key]
    const node = isObject(valueBefore) && isObject(valueAfter)
      ? buildDiff(valueBefore, valueAfter)
      : !has(before, key)
        ? buildProperty(valueAfter, statuses.added)
        : !has(after, key)
          ? buildProperty(valueBefore, statuses.deleted)
          : !isEqual(valueBefore, valueAfter)
            ? buildProperty([valueBefore, valueAfter], statuses.changed)
            : buildProperty(valueBefore)
    return { ...acc, [key]: node }
  }, {})
}

const types = {
  diff: 'diff',
  prop: 'property'
}

const statuses = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed'
}

const isDiff = (node) => node.type === types.diff
const isProp = (node) => node.type === types.prop

// =====================================
//  EXPORT
// =====================================

export {
  statuses,
  isDiff,
  isProp
}

export default genDiff
