import yaml from 'js-yaml'
import ini from 'ini'

const parse = (content, format) => {
  switch (format) {
    case 'json': return JSON.parse(content)
    case 'yaml': return yaml.safeLoad(content)
    case 'ini': return ini.parse(content)
    default: throw new Error(`Unknown format ${format}`)
  }
}

export default parse
