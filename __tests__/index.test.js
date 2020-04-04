import fs from 'fs'
import path from 'path'
import { trim, each } from 'lodash'

import gendiff from '../src'

const getFixturePath = (filename) => {
  return path.join(__dirname, '..', '__fixtures__', filename)
}

const readFixtureFile = (filename) => {
  return fs.readFileSync(getFixturePath(filename), 'utf8') |> trim
}

let snapshots

beforeAll(() => {
  snapshots = {
    plain: readFixtureFile('plain'),
    structured: readFixtureFile('structured'),
    json: readFixtureFile('json')
  }
})

describe('gendiff', () => {
  test.each(['json', 'yaml', 'ini'])('%s', (extname) => {
    const filepath1 = getFixturePath(`before.${extname}`)
    const filepath2 = getFixturePath(`after.${extname}`)

    each(snapshots, (snapshot, format) => {
      expect(gendiff(filepath1, filepath2, format)).toEqual(snapshot)
    })
  })
})
