#!/usr/bin/env node

const formatArgName = x => x.replaceAll('-', '_').toLocaleUpperCase()

const [arg1, arg1V, arg2, arg2V] = process.argv.slice(-4)

const args = {
  [formatArgName(arg1)]: arg1V,
  [formatArgName(arg2)]: arg2V
}

const {
  BASE_DIRECTORY,
  LAMBDA_NAME
} = args

if(!BASE_DIRECTORY) throw new Error('Must contain a BASE_DIRECTORY argument')
if(!LAMBDA_NAME) throw new Error('Must contain a LAMBDA_NAME argument')

const plugin = require('../lib/index.js').default

plugin({ 
    baseDirectory: BASE_DIRECTORY, 
    lambdaName: LAMBDA_NAME 
})