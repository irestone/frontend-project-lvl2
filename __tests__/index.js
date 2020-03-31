import fs from 'fs'
import path from 'path'
import { trim } from 'lodash'

import gendiff from '../src'

const getPath = (filename) => {
  return path.join(__dirname, '..', '__fixtures__', filename)
}

const readFile = (filepath) => fs.readFileSync(filepath, 'utf8')

describe('gendiff', () => {
  describe('works with', () => {
    const snapshot = getPath('plain') |> readFile |> trim

    test.each(['json', 'yaml', 'ini'])('%s files', (extname) => {
      const filepath1 = getPath(`before.${extname}`)
      const filepath2 = getPath(`after.${extname}`)
      expect(gendiff(filepath1, filepath2)).toEqual(snapshot)
    })
  })

  describe('outputs in', () => {
    const filepath1 = getPath('before.json')
    const filepath2 = getPath('after.json')

    test.each(['plain', 'structured', 'json'])('%s format', (format) => {
      const snapshot = getPath(format) |> readFile |> trim
      expect(gendiff(filepath1, filepath2, format)).toEqual(snapshot)
    })
  })
})
