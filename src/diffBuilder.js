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
const getName = ({ name }) => name
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
        name: key,
        type: types.nested,
        children: buildDiff(valueBefore, valueAfter)
      })
    }

    if (!has(before, key)) {
      return makeNode({
        name: key,
        type: types.added,
        value: valueAfter
      })
    }

    if (!has(after, key)) {
      return makeNode({
        name: key,
        type: types.deleted,
        value: valueBefore
      })
    }

    if (!isEqual(valueBefore, valueAfter)) {
      return makeNode({
        name: key,
        type: types.changed,
        valueBefore,
        valueAfter
      })
    }

    return makeNode({
      name: key,
      type: types.unchanged,
      value: valueBefore
    })
  }, [])
}

export {
  types,
  getType,
  getName,
  getValue,
  getValueBefore,
  getValueAfter,
  getChildren
}
export default buildDiff
