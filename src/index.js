import fs from 'fs'
import path from 'path'

import { getParser } from './parsers'
import { getFormatter, defaultFormatter } from './formatters'
import { buildDiff } from './diffBuilder'

export default (filepath1, filepath2, format) => {
  const parse = getParser(path.extname(filepath1).slice(1))
  const before = fs.readFileSync(filepath1, 'utf8') |> parse
  const after = fs.readFileSync(filepath2, 'utf8') |> parse
  const stringify = format ? getFormatter(format) : defaultFormatter
  return buildDiff(before, after) |> stringify
}
