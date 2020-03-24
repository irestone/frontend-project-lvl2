#!/usr/bin/env node

import { program } from 'commander'

import genDiff from '..'

program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<pathToFile1> <pathToFile2>')
  .option('-f, --format <type>', 'output format', 'json')
  .action((pathToFile1, pathToFile2, options) => {
    const diff = genDiff(pathToFile1, pathToFile2)
    console.log(diff)
  })
  .parse(process.argv)
