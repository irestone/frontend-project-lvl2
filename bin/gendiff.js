#!/usr/bin/env node

import commander from 'commander'

const { program } = commander

program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .parse(process.argv)
