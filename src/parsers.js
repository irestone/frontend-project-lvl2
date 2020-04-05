import { mapValues, isObject, isString, isEmpty, toNumber } from 'lodash'

import yaml from 'js-yaml'
import ini from 'ini'

const getParser = (format) => {
  switch (format) {
    case 'json': return JSON.parse
    case 'yaml': return yaml.safeLoad
    case 'ini': return (string) => ini.parse(string) |> normalize
    default: throw new Error(`Unsupported file format: ${format}`)
  }
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
      return parseNumber(value) || value
    }
    return value
  })
}

const parseNumber = (string) => {
  return isEmpty(string) ? NaN : toNumber(string)
}

export default (content, format) => {
  const parse = getParser(format)
  return parse(content)
}
