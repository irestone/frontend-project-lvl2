import { union, isObject, has, isEqual, cloneDeep } from 'lodash'

const types = {
  added: 'added',
  deleted: 'deleted',
  changed: 'changed',
  unchanged: 'unchanged',
  nested: 'nested'
}

const buildDiff = (before, after) => {
  const keys = union(Object.keys(before), Object.keys(after)).sort()
  return keys.reduce((acc, key) => {
    const valueBefore = before[key]
    const valueAfter = after[key]

    if (isObject(valueBefore) && isObject(valueAfter)) {
      const node = makeNode({
        name: key,
        type: types.nested,
        children: buildDiff(valueBefore, valueAfter)
      })
      return [...acc, node]
    }

    if (!has(before, key)) {
      const node = makeNode({
        name: key,
        type: types.added,
        value: valueAfter
      })
      return [...acc, node]
    }

    if (!has(after, key)) {
      const node = makeNode({
        name: key,
        type: types.deleted,
        value: valueBefore
      })
      return [...acc, node]
    }

    if (!isEqual(valueBefore, valueAfter)) {
      const node = makeNode({
        name: key,
        type: types.changed,
        value: {
          before: valueBefore,
          after: valueAfter
        }
      })
      return [...acc, node]
    }

    const node = makeNode({
      name: key,
      type: types.unchanged,
      value: valueBefore
    })

    return [...acc, node]
  }, [])
}

const makeNode = (config) => cloneDeep(config)
const getType = ({ type }) => type
const getName = ({ name }) => name
const getValue = ({ value }) => value
const getChildren = ({ children }) => children

export { types, getType, getName, getValue, getChildren }
export default buildDiff
