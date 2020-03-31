import plain from './plain'
import structured from './structured'

const getFormatter = (format) => {
  switch (format) {
    case 'plain': return plain
    case 'structured': return structured
    default: throw new Error(`Unknown format "${format}"`)
  }
}

export {
  getFormatter,
  plain as defaultFormatter
}
