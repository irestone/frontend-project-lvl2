const genDiff = (pathToFile1, pathToFile2, options) => {
  return `${options.format} diff of "${pathToFile1}" and "${pathToFile2}" `
}

export default genDiff
