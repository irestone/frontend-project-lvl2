import fs from 'fs'
import path from 'path'
import { trim } from 'lodash'

import { parseFile } from '../src/parser'
import { buildDiff, stringify } from '../src'

const getPath = (filename) => {
  return path.join(__dirname, '..', '__fixtures__', filename)
}

const readFile = (filepath) => fs.readFileSync(filepath, 'utf8')

describe('parseFile', () => {
  const before = getPath('before.json') |> readFile |> JSON.parse
  const after = getPath('after.json') |> readFile |> JSON.parse

  test.each(['json', 'yaml', 'ini'])('%s', (extname) => {
    expect(getPath(`before.${extname}`) |> parseFile).toEqual(before)
    expect(getPath(`after.${extname}`) |> parseFile).toEqual(after)
  })
})

describe('gendiff', () => {
  const before = getPath('before.json') |> parseFile
  const after = getPath('after.json') |> parseFile
  const diff = getPath('diff.json') |> parseFile
  const snapshot = getPath('snapshot') |> readFile |> trim

  test('buildDiff', () => {
    expect(buildDiff(before, after)).toEqual(diff)
  })

  test.skip('stringify', () => {
    expect(stringify(diff)).toEqual(snapshot)
  })
})
