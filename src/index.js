import fs from 'fs'
import path from 'path'

import { parse } from './parsers'
import { format } from './formatters'
import buildDiff from './diffBuilder'

const getFileFormat = (filepath) => path.extname(filepath).slice(1)

const parseFile = (filepath) => {
  const content = fs.readFileSync(filepath, 'utf8')
  const format = getFileFormat(filepath)
  return parse(content, format)
}

export default (firstConfigPath, secondConfigPath, formatName = 'plain') => {
  const before = parseFile(firstConfigPath)
  const after = parseFile(secondConfigPath)
  const diff = buildDiff(before, after)
  return format(diff, formatName)
}
