import { union, isObject, has, isEqual } from 'lodash'

const types = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
  nested: 'nested'
}

const buildDiff = (before, after) => {
  const keys = union(Object.keys(before), Object.keys(after))
  return keys.reduce((acc, key) => {
    const valueBefore = before[key]
    const valueAfter = after[key]

    if (isObject(valueBefore) && isObject(valueAfter)) {
      return [...acc, [types.nested, key, buildDiff(valueBefore, valueAfter)]]
    }

    if (!has(before, key)) {
      return [...acc, [types.added, key, valueAfter]]
    }

    if (!has(after, key)) {
      return [...acc, [types.deleted, key, valueBefore]]
    }

    if (!isEqual(valueBefore, valueAfter)) {
      return [...acc, [types.changed, key, [valueBefore, valueAfter]]]
    }

    return [...acc, [types.unchanged, key, valueBefore]]
  }, [])
}

export { types }
export default buildDiff
