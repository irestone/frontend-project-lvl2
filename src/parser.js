import fs from 'fs'
import path from 'path'
import { mapValues, isObject, isString } from 'lodash'

import yaml from 'js-yaml'
import ini from 'ini'

const parseFile = (filepath) => {
  const parse = getParser(path.extname(filepath).slice(1))
  return fs.readFileSync(filepath, 'utf8') |> parse
}

const getParser = (format) => {
  switch (format) {
    case 'json': return JSON.parse
    case 'yaml': return yaml.safeLoad
    case 'ini': return iniParse
    default: throw new Error(`Unknown format ${format}`)
  }
}

const iniParse = (content) => {
  const parsed = ini.parse(content)

  const normalize = (obj) => {
    return mapValues(obj, (value) => {
      return isObject(value)
        ? normalize(value)
        : isString(value) && value.match(/^\d+$/)
          ? Number(value)
          : value
    })
  }

  return normalize(parsed)
}

export {
  parseFile,
  getParser
}
