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

export {
  buildDiff,
  statuses,
  isDiff
}
