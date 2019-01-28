const fs = require('fs')
const path = require('path')

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

mkdirSync(path.resolve('./chatHistory'))
fs.appendFileSync("./chatHistory/p.txt","hello here!\n hello");