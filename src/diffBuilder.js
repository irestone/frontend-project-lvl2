import { union, isObject, has, isEqual } from 'lodash'

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

    if (isObject(valueBefore) && isObject(valueAfter)) {
      return { ...acc, [key]: buildDiff(valueBefore, valueAfter) }
    }

    if (!has(before, key)) {
      return { ...acc, [key]: buildProperty(valueAfter, statuses.added) }
    }

    if (!has(after, key)) {
      return { ...acc, [key]: buildProperty(valueBefore, statuses.deleted) }
    }

    if (!isEqual(valueBefore, valueAfter)) {
      return {
        ...acc,
        [key]: buildProperty([valueBefore, valueAfter], statuses.changed)
      }
    }

    return { ...acc, [key]: buildProperty(valueBefore, statuses.unchanged) }
  }, {})
}

const types = {
  diff: 'diff',
  prop: 'property'
}

const statuses = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged'
}

const isDiff = (node) => node.type === types.diff

export {
  buildDiff,
  statuses,
  isDiff
}
