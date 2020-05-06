import { union, isObject, has, isEqual } from 'lodash'

const types = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
  nested: 'nested'
}

const makeNode = (type, body) => ({ type, ...body })
const getType = ({ type }) => type
const getKey = ({ key }) => key
const getValueBefore = ({ valueBefore }) => valueBefore
const getValueAfter = ({ valueAfter }) => valueAfter
const getChildren = ({ children }) => children

const buildDiff = (before, after) => {
  const keys = union(Object.keys(before), Object.keys(after)).sort()
  return keys.map((key) => {
    const valueBefore = before[key]
    const valueAfter = after[key]

    const baseNodeBody = { key, valueBefore, valueAfter }

    if (!has(before, key)) {
      return makeNode(types.added, baseNodeBody)
    }

    if (!has(after, key)) {
      return makeNode(types.deleted, baseNodeBody)
    }

    if (isObject(valueBefore) && isObject(valueAfter)) {
      return makeNode(
        types.nested,
        { key, children: buildDiff(valueBefore, valueAfter) }
      )
    }

    if (!isEqual(valueBefore, valueAfter)) {
      return makeNode(types.changed, baseNodeBody)
    }

    return makeNode(types.unchanged, baseNodeBody)
  })
}

export {
  types,
  makeNode,
  getType,
  getKey,
  getValueBefore,
  getValueAfter,
  getChildren
}
export default buildDiff
