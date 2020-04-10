import { union, isObject, has, isEqual, cloneDeep } from 'lodash'

const types = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
  nested: 'nested'
}

const makeNode = (config) => cloneDeep(config)
const getType = ({ type }) => type
const getKey = ({ key }) => key
const getValue = ({ value }) => value
const getValueBefore = ({ valueBefore }) => valueBefore
const getValueAfter = ({ valueAfter }) => valueAfter
const getChildren = ({ children }) => children

const buildDiff = (before, after) => {
  const keys = union(Object.keys(before), Object.keys(after)).sort()
  return keys.map((key) => {
    const valueBefore = before[key]
    const valueAfter = after[key]

    if (isObject(valueBefore) && isObject(valueAfter)) {
      return makeNode({
        type: types.nested,
        key,
        children: buildDiff(valueBefore, valueAfter)
      })
    }

    if (!has(before, key)) {
      return makeNode({
        type: types.added,
        key,
        value: valueAfter
      })
    }

    if (!has(after, key)) {
      return makeNode({
        type: types.deleted,
        key,
        value: valueBefore
      })
    }

    if (!isEqual(valueBefore, valueAfter)) {
      return makeNode({
        type: types.changed,
        key,
        valueBefore,
        valueAfter
      })
    }

    return makeNode({
      type: types.unchanged,
      key,
      value: valueBefore
    })
  }, [])
}

export {
  types,
  getType,
  getKey,
  getValue,
  getValueBefore,
  getValueAfter,
  getChildren
}
export default buildDiff
