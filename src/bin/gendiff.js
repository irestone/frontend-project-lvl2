#!/usr/bin/env node

import { program } from 'commander'

import genDiff from '..'

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format <type>', 'output format', 'plain')
  .action((firstConfig, secondConfig, { format }) => {
    const diff = genDiff(firstConfig, secondConfig, format)
    console.log(diff)
  })
  .parse(process.argv)
