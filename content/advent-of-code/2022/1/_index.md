---
title: 2022 - Day 1
date: 2023-11-30T16:00:00.000-08:00
toc: false
puzzle_link: https://adventofcode.com/2022/day/1
solved: 
  part1: true
  part2: true
---

# Intro

The puzzle prompt on [adventofcode.com](https://adventofcode.com/2022/day/1)

```
# run solution with test data
zx content/advent-of-code/2022/1/_index.md

# run solution with input file data
zx content/advent-of-code/2022/1/_index.md content/advent-of-code/2022/1/input.txt
```

# Code

```js
const assert = require('assert')
debug(argv)
const [inputFile] = argv._

const sampleData = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

const sampleSolutions = {
  part1: 24000,
  part2: 45000
}

let inputContent
if (inputFile) {
  debug(`input file specified, loading data from: ${inputFile}`)
  inputContent = await fs.readFile(inputFile, 'utf-8')
} else {
  debug(`no input file specified, using sample data`)
  inputContent = sampleData
}

const caloriesPerElf = inputContent
  .split('\n\n')
  .map(elf => elf.split('\n'))
  .map((foodItems) => {
    return foodItems.reduce((total, item, i, arr) => {
      debug(`${i}: ${item}`)
      total += parseInt(item, 10)
      return total
    }, 0)
  })

if (!inputFile) debug(caloriesPerElf)

const maxCalories = {index: -1, value: -1}
caloriesPerElf.forEach((elfTotalCalories, i) => {
  if (elfTotalCalories > maxCalories.value) {
    maxCalories.index = i
    maxCalories.value = elfTotalCalories
  }
})

console.log(`Part 1: Elf ${maxCalories.index + 1} has the most total calories: ${maxCalories.value}`)

if (!inputFile) assert.equal(maxCalories.value, sampleSolutions.part1, 'part 1 solution should be correct')

const elvesRankedByCaloriesDescending = caloriesPerElf.sort((a, b) => {
  if (a > b) return -1
  if (a < b) return 1
  else return 0
})

if (!inputFile) debug(elvesRankedByCaloriesDescending)

const [first, second, third] = elvesRankedByCaloriesDescending

const topThreeCalorieSum = first + second + third

console.log(`Part 2: The top three Elves are carrying a calorie total of: ${topThreeCalorieSum}`)

if (!inputFile) assert.equal(topThreeCalorieSum, sampleSolutions.part2, 'part 2 solution should be correct')

function debug (msg) {
  if (process.env.DEBUG) console.log(msg)  
}
```