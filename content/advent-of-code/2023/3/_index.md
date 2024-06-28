---
title: 2023 - Day 3
date: 2023-12-01T21:00:00.000-08:00
toc: false
puzzle_link: https://adventofcode.com/2023/day/3
solved: 
  part1: false
  part2: false
---

# Intro

The puzzle prompt on [adventofcode.com](https://adventofcode.com/2023/day/3)

```
# run solution with test data
zx content/advent-of-code/2023/3/_index.md

# run solution with input file data
zx content/advent-of-code/2023/3/_index.md content/advent-of-code/2023/3/input.txt
```

# Code

```js
const assert = require('assert')
debug(argv)
const [inputFile] = argv._

const sampleData = {
  part1: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`
}

const sampleSolutions = {
  part1: 4361,
  part2: ''
}

let inputContent
if (inputFile) {
  debug(`input file specified, loading data from: ${inputFile}`)
  inputContent = await fs.readFile(inputFile, 'utf-8')
} else {
  debug(`no input file specified, using part 1 sample data`)
  inputContent = sampleData.part1
}

// get location of all symbols
// get location of all numbers. number, start location, end location
// for each number, is it adjacent to a symbol? 
  // if yes, add to partNumbers, else drop it

const lines = inputContent.split('\n')
const symbols = []
const numbers = []
const singleNumberPattern = /[0-9]{1}/

lines.forEach((line, lineNumber) => {
  let activeNumber = {}

  for(let ix = 0; ix < line.length; ix++) {
    if (line[ix].match(singleNumberPattern)) {
      if (!activeNumber.value) {
        activeNumber = {
         value: line[ix],
         lineNumber,
         startIx: ix
        }
      } else {
        activeNumber.value = `${activeNumber.value}${line[ix]}`
        activeNumber.endIx = ix
      }
    } else {
      if (activeNumber.value) {
        activeNumber.value = parseInt(activeNumber.value, 10)
        numbers.push(activeNumber)
        activeNumber = {}
      }

      if (line[ix] !== '.') {
        symbols.push({
          value: line[ix],
          lineNumber,
          charIndex: ix
        })
      }
    }
  }
})

// console.log(symbols)
// console.log(numbers)

const partNumbers = [] 
numbers.forEach(number => {
  symbols.forEach(symbol => {
    if (symbolIsAdjacentToNumber(symbol, number)) partNumbers.push(number)
  })
})

function symbolIsAdjacentToNumber (symbol, number) {
  const symbolIs = {
    sameLineAsNumber: symbol.lineNumber === number.lineNumber,
    oneLineAboveNumber: symbol.lineNumber === number.lineNumber - 1,
    oneLineBelowNumber: symbol.lineNumber === number.lineNumber + 1,
    oneCharIxToLeftOfNumber: symbol.charIndex === number.startIx - 1,
    oneCharIxToRightOfNumber: symbol.charIndex === number.endIx + 1,
    overlappingCharIxOfNumber: symbol.charIndex >= number.startIx && symbol.charIndex <= number.endIx
  }

  
  let isAdjacent
  if (!symbolIs.sameLineAsNumber && !symbolIs.oneLineAboveNumber && !symbolIs.oneLineBelowNumber) {
    isAdjacent = false
  } else if (symbolIs.oneCharIxToLeftOfNumber || symbolIs.oneCharIxToRightOfNumber || symbolIs.overlappingCharIxOfNumber) {
    isAdjacent = true
  } else {
    isAdjacent = false
  }

  return isAdjacent
}

// console.log(partNumbers)

const partNumbersSum = partNumbers.reduce((sum, partNumber) => {
  sum += partNumber.value
  return sum
}, 0)

console.log(partNumbersSum)

// const games = inputContent
//   .split('\n')
//   .map(value => value.toLowerCase())
//   .map(value => {
//     const gameNumber = parseInt(value.match(/^game [0-9]*/)[0].split(' ')[1], 10)
//     const gameText = value.replace(/^game [0-9]*\: /, '')
//     const grabs = gameText.split('; ')
//     // debug(grabs)
//     const grabReveals = grabs
//       .map(sr => sr.split(', '))
//       .map(rev => {
//         // debug(rev)
//         const samples = rev
//           .map(s => {
//             const [quantity, color] = s.split(' ')
//             return {
//               quantity: parseInt(quantity, 10),
//               color
//             }
//           })
//         // debug(samples)
//         return samples
//         // return {color, quantity}
//       })

//     return {
//       gameNumber,
//       gameText,
//       grabs,
//       grabReveals
//     }
//   })

// // if (!inputFile) debug(games[0].grabReveals)

// games.forEach(game => {
//   let gameIsPossible = true
//   const maxByColor = {
//     red: -1,
//     green: -1,
//     blue: -1,
//   }
//   game.grabReveals.forEach(gr => {
//     gr.forEach(reveal => {
//       if (reveal.quantity > bagContents[reveal.color]) gameIsPossible = false
//       if (reveal.quantity > maxByColor[reveal.color]) maxByColor[reveal.color] = reveal.quantity
//     })
//   })
//   game.isPossible = gameIsPossible
//   game.maxByColor = maxByColor
// })

// if (!inputFile) debug(games[0])

// const possibleGame = games.filter(game => game.isPossible)
// const possibleGameIdsSummed = possibleGame.reduce((memo, game) => {
//   memo += game.gameNumber
//   return memo
// }, 0)

// console.log(`Part 1: Sum of valid game ids: ${possibleGameIdsSummed}`)

// if (!inputFile) assert.equal(possibleGameIdsSummed, sampleSolutions.part1, 'part 1 solution should match expected')

// const gamePowers = games.map(g => {
//   const gamePower = Object.values(g.maxByColor).reduce((memo, val) => {
//     if (memo === 0) return val
//     memo *= val
//     return memo
//   }, 0)
//   return gamePower
// })

// const powerSums = gamePowers.reduce((memo, power) => {
//   memo += power
//   return memo
// }, 0)

// if (!inputFile) assert.equal(powerSums, sampleSolutions.part2, 'part 2 solution should match expected')

// console.log(`Part 2: Sum of game powers: ${powerSums}`)

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```