import yaml from 'js-yaml'

const parse = (content, format) => {
  switch (format) {
    case 'json': return JSON.parse(content)
    case 'yaml': return yaml.safeLoad(content)
    default: throw new Error(`Unknown format ${format}`)
  }
}

export default parse
