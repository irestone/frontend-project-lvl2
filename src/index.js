import fs from 'fs'
import { intersection, difference, isEqual, concat } from 'lodash'

const genDiff = (pathToFile1, pathToFile2, options) => {
  const data1 = fs.readFileSync(pathToFile1, 'utf8') |> JSON.parse
  const data2 = fs.readFileSync(pathToFile2, 'utf8') |> JSON.parse
  const comparison = compare(data1, data2)

  const unchanged = comparison.same.map(key => line.unchanged(data1, key))
  const removed = comparison.unique[0].map(key => line.removed(data1, key))
  const added = comparison.unique[1].map(key => line.added(data2, key))
  const modified = comparison.different.map(key => [
    line.removed(data1, key),
    line.added(data2, key)
  ]).flat()

  return `{\n${concat(unchanged, removed, added, modified).join('\n')}\n}`
}

const compare = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)
  const commonKeys = intersection(obj1Keys, obj2Keys)

  const same = commonKeys.filter((key) => isEqual(obj1[key], obj2[key]))
  const different = difference(commonKeys, same)
  const unique = [
    difference(obj1Keys, commonKeys),
    difference(obj2Keys, commonKeys)
  ]

  return { same, different, unique }
}

const line = {
  added: (obj, key) => `  + ${key}: ${obj[key]}`,
  removed: (obj, key) => `  - ${key}: ${obj[key]}`,
  unchanged: (obj, key) => `    ${key}: ${obj[key]}`
}

export default genDiff
