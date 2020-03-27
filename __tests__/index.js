import path from 'path'

import gendiff from '../src'

const getFixturePath = (filename) => {
  return path.join(__dirname, '..', '__fixtures__', filename)
}

describe('gendiff', () => {
  test.each(['json', 'yaml', 'ini'])('%s', (ext) => {
    const beforePath = getFixturePath(`before.${ext}`)
    const afterPath = getFixturePath(`after.${ext}`)
    const diff = gendiff(beforePath, afterPath)

    expect(diff).toMatch(/^{\n( {2}( |\+|-) \w+: .+\n)*}$/gm)

    const lines = diff.split('\n')

    expect(lines).toHaveLength(7)

    expect(lines).toContain('    d: d')
    expect(lines).toContain('  - b: b')
    expect(lines).toContain('  + c: c')
    expect(lines).toContain('  - a: a')
    expect(lines).toContain('  + a: aa')

    expect(Math.abs(
      lines.indexOf('  - a: a') - lines.indexOf('  + a: aa')
    )).toBe(1)
  })
})
