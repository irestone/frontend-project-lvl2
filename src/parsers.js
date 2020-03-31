import { mapValues, isObject, isString, isEmpty, toNumber } from 'lodash'

import yaml from 'js-yaml'
import ini from 'ini'

const iniParse = (content) => {
  const parsed = ini.parse(content)

  const normalize = (obj) => {
    return mapValues(obj, (value) => {
      return isObject(value)
        ? normalize(value)
        : (isString(value) && !isEmpty(value) && toNumber(value)) || value
    })
  }

  return normalize(parsed)
}

const getParser = (format) => {
  switch (format) {
    case 'json': return JSON.parse
    case 'yaml': return yaml.safeLoad
    case 'ini': return iniParse
    default: throw new Error(`Unsupported file format: ${format}`)
  }
}

export {
  getParser
}
