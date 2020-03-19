#!/usr/bin/env node

import commander from 'commander'

const { program } = commander

program.version('0.1.0')

program.parse(process.argv)
