---
title: 2023 - Day 1
date: 2023-11-30T21:00:00.000-08:00
toc: false
puzzle_link: https://adventofcode.com/2023/day/1
solved: 
  part1: true
  part2: true
---

# Intro

The puzzle prompt on [adventofcode.com](https://adventofcode.com/2023/day/1)

```
# run solution with test data
zx content/advent-of-code/2023/1/_index.md

# run solution with input file data
zx content/advent-of-code/2023/1/_index.md content/advent-of-code/2023/1/input.txt
```

# Code

```js
const assert = require('assert')
debug(argv)
const [inputFile] = argv._

const sampleData = {
  part1: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
  part2: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`
}

const sampleSolutions = {
  part1: 142,
  part2: 281
}

let inputContent
if (inputFile) {
  debug(`input file specified, loading data from: ${inputFile}`)
  inputContent = await fs.readFile(inputFile, 'utf-8')
} else {
  debug(`no input file specified, using part 1 sample data`)
  inputContent = sampleData.part1
}

const calibrationSum = inputContent
  .split('\n')
  .map(value => value.toLowerCase())
  .map(value => value.replace(/[a-z]*/g, '').split(''))
  .map((coordinates) => {
    const first = coordinates[0]
    const last = coordinates[coordinates.length - 1]
    return parseInt(`${first}${last}`, 10)
  })
  .reduce((total, item, i, arr) => {
    total += item
    return total
  }, 0)

if (!inputFile) debug(calibrationSum)

console.log(`Part 1: Sum of all calibration values is: ${calibrationSum}`)

if (!inputFile) assert.equal(calibrationSum, sampleSolutions.part1, 'part 1 solution should match expected')

const wordMap = {
  eight: '8',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  nine: '9'
}

if (!inputFile) {
  debug(`no input file specified, using part 2 sample data`)
  inputContent = sampleData.part2
}

const calibrationSumPart2 = inputContent
  .split('\n')
  .map(value => value.toLowerCase())
  .map((value, i) => {
    debug(`before: ${value}`)
    for (let n = 0; n < value.length; n++) {
      let substr = value.slice(n)
      Object.keys(wordMap).forEach((numberWord) => {
        if (substr.match(new RegExp(`^${numberWord}`))) {
          value = value.replace(numberWord, wordMap[numberWord])
        }
      })
    }

    return value
  })
  .map((value, i) => {
    debug(`${i}: ${value}`)
    const numbersOnly = value.replace(/[a-z]*/g, '').split('')
    debug(`${i}: ${numbersOnly}`)
    return numbersOnly
  })
  .map((coordinates) => {
    const first = coordinates[0]
    const last = coordinates[coordinates.length - 1]
    return parseInt(`${first}${last}`, 10)
  })
  .reduce((total, item, i, arr) => {
    total += item
    return total
  }, 0)

if (!inputFile) debug(calibrationSumPart2)

console.log(`Part 2: Sum of all values with spelled numbers converted is: ${calibrationSumPart2}`)

if (!inputFile) assert.equal(calibrationSumPart2, sampleSolutions.part2, 'part 2 solution should match expected')

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```