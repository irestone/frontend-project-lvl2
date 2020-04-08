import { mapValues, isObject, isString, isEmpty, toNumber, has } from 'lodash'

import yaml from 'js-yaml'
import ini from 'ini'

const parsers = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  ini: (string) => ini.parse(string) |> normalize
}

/**
 * Recursively traverses an object converting values to a certain standard
 */
const normalize = (object) => {
  return mapValues(object, (value) => {
    if (isObject(value)) {
      return normalize(value)
    }
    if (isString(value)) {
      // some parsers (ini) read a number as a string
      const num = toNumber(value)
      // toNumber() converts '' to 0, so an additional check is required
      return isNaN(num) || isEmpty(value) ? value : num
    }
    return value
  })
}

const parse = (content, formatName) => {
  if (!has(parsers, formatName)) {
    throw new Error(`Unsupported file format: ${formatName}`)
  }
  const parse = parsers[formatName]
  return parse(content)
}

export {
  parse
}
