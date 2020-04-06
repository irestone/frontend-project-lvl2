import { has } from 'lodash'

import plain from './plain'
import structured from './structured'

const formatters = {
  plain,
  structured,
  json: JSON.stringify
}

const format = (content, formatName) => {
  if (!has(formatters, formatName)) {
    throw new Error(`Unknown format "${formatName}"`)
  }
  const format = formatters[formatName]
  return format(content)
}

export {
  format
}
