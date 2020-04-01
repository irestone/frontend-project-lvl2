import fs from 'fs'
import path from 'path'
import { trim } from 'lodash'

import gendiff from '../src'

const getFixturePath = (filename) => {
  return path.join(__dirname, '..', '__fixtures__', filename)
}

const readFile = (filepath) => fs.readFileSync(filepath, 'utf8')

describe('gendiff', () => {
  describe('works with', () => {
    const snapshot = getFixturePath('plain') |> readFile |> trim

    test.each(['json', 'yaml', 'ini'])('%s files', (extname) => {
      const filepath1 = getFixturePath(`before.${extname}`)
      const filepath2 = getFixturePath(`after.${extname}`)
      expect(gendiff(filepath1, filepath2)).toEqual(snapshot)
    })
  })

  describe('outputs in', () => {
    const filepath1 = getFixturePath('before.json')
    const filepath2 = getFixturePath('after.json')

    test.each(['plain', 'structured', 'json'])('%s format', (format) => {
      const snapshot = getFixturePath(format) |> readFile |> trim
      expect(gendiff(filepath1, filepath2, format)).toEqual(snapshot)
    })
  })
})
