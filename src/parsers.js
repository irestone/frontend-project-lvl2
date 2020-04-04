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

const normalize = (object) => {
  return mapValues(object, (value) => {
    return isObject(value)
      ? normalize(value)
      : (isString(value) && !isEmpty(value) && toNumber(value)) || value
  })
}

export default (content, format) => {
  const parse = getParser(format)
  return parse(content)
}
