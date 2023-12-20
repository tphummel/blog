---
title: 2023 - Day 2
date: 2023-12-01T21:00:00.000-08:00
toc: false
puzzle_link: https://adventofcode.com/2023/day/2
solved: 
  part1: false
  part2: false
---

# Intro

The puzzle prompt on [adventofcode.com](https://adventofcode.com/2023/day/2)

```
# run solution with test data
zx content/advent-of-code/2023/2/_index.md

# run solution with input file data
zx content/advent-of-code/2023/2/_index.md content/advent-of-code/2023/2/input.txt
```

# Code

```js
const assert = require('assert')
debug(argv)
const [inputFile] = argv._

const sampleData = {
  part1: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`
}

const bagContents = {
  red: 12,
  green: 13,
  blue: 14
}

const sampleSolutions = {
  part1: 8,
}

let inputContent
if (inputFile) {
  debug(`input file specified, loading data from: ${inputFile}`)
  inputContent = await fs.readFile(inputFile, 'utf-8')
} else {
  debug(`no input file specified, using part 1 sample data`)
  inputContent = sampleData.part1
}

const games = inputContent
  .split('\n')
  .map(value => value.toLowerCase())
  .map(value => {
    const gameNumber = parseInt(value.match(/^game [0-9]*/)[0].split(' ')[1], 10)
    const gameText = value.replace(/^game [0-9]*\: /, '')
    const grabs = gameText.split('; ')
    // debug(grabs)
    const grabReveals = grabs
      .map(sr => sr.split(', '))
      .map(rev => {
        // debug(rev)
        const samples = rev
          .map(s => {
            const [quantity, color] = s.split(' ')
            return {
              quantity: parseInt(quantity, 10),
              color
            }
          })
        // debug(samples)
        return samples
        // return {color, quantity}
      })

    return {
      gameNumber,
      gameText,
      grabs,
      grabReveals
    }
  })

if (!inputFile) debug(games[0].grabReveals)



const validGames = games.filter(game => {
  let gameIsPossible = true
  game.grabReveals.forEach(gr => {
    gr.forEach(reveal => {
      if (reveal.quantity > bagContents[reveal.color]) gameIsPossible = false
    })
  })
  return gameIsPossible
})

const validGamesIdSummed = validGames.reduce((memo, game) => {
  memo += game.gameNumber
  return memo
}, 0)

console.log(`Part 1: Sum of valid game ids: ${validGamesIdSummed}`)

if (!inputFile) assert.equal(validGamesIdSummed, sampleSolutions.part1, 'part 1 solution should match expected')

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```