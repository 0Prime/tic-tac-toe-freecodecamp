const { pipe } = require('./tools')


const xo = n => n % 2 === 0 ? 'X' : 'O'
const addNewLines = (acc, x, i) => acc.concat(i % 3 == 0 ? `\n${x}` : x)


const visualizeGameField = (moves) =>
  pipe(
    '---------'.split(''),
    field => !moves ? field :
    field.map((cell, cellIdx) => pipe(
      moves.findIndex(move => move == cellIdx),
      moveIdx => moveIdx != -1 ? xo(moveIdx) : cell)),
    field => field.reduce(addNewLines, []),
  ).join('')


module.exports = {
  visualizeGameField: visualizeGameField
}
