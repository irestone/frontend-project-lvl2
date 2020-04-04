import fs from 'fs'
import path from 'path'

import parse from './parsers'
import { getFormatter, defaultFormatter } from './formatters'
import { buildDiff } from './diffBuilder'

const getFileFormat = (filepath) => path.extname(filepath).slice(1)

export default (firstConfigPath, secondConfigPath, formatName) => {
  const firstConfigContent = fs.readFileSync(firstConfigPath, 'utf8')
  const firstConfigFormat = getFileFormat(firstConfigPath)
  const before = parse(firstConfigContent, firstConfigFormat)

  const secondConfigContent = fs.readFileSync(secondConfigPath, 'utf8')
  const secondConfigFormat = getFileFormat(secondConfigPath)
  const after = parse(secondConfigContent, secondConfigFormat)

  const format = formatName ? getFormatter(formatName) : defaultFormatter

  return buildDiff(before, after) |> format
}
