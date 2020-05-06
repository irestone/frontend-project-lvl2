import { union, isObject, has, isEqual } from 'lodash'

const types = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
  nested: 'nested'
}

const buildDiff = (before, after) => {
  const keys = union(Object.keys(before), Object.keys(after)).sort()
  return keys.map((key) => {
    const valueBefore = before[key]
    const valueAfter = after[key]

    if (!has(before, key)) {
      return { type: types.added, key, valueAfter }
    }

    if (!has(after, key)) {
      return { type: types.deleted, key, valueBefore }
    }

    if (isObject(valueBefore) && isObject(valueAfter)) {
      return {
        type: types.nested,
        key,
        children: buildDiff(valueBefore, valueAfter)
      }
    }

    if (!isEqual(valueBefore, valueAfter)) {
      return {
        type: types.changed,
        key,
        valueBefore,
        valueAfter
      }
    }

    return { type: types.unchanged, key, valueBefore, valueAfter }
  })
}

export { types }
export default buildDiff
