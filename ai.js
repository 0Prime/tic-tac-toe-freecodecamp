const { pipe, splitBy, swap, curry, intersection, autocurry, sortPair, isEven } = require('./tools')
const { makeMove, allLines } = require('./backend')


const movesInLineCount = (moves, line) => line && moves ?
  moves.filter(m => line.includes(m)).length : 0


const linesFn = autocurry((allLines, oMoves, eMoves, oCount, eCount) =>
  allLines.filter(l =>
    movesInLineCount(oMoves, l) === oCount &&
    movesInLineCount(eMoves, l) === eCount))


const splitMovesFn = moves =>
  sortPair(isEven(moves.length), splitBy((x, i) => isEven(i), moves))


const movesFn = autocurry((moves, lines) =>
  moves.filter(m => lines.some(l => l.includes(m))))


const priorities = [
  [4],
  [0, 2, 6, 8],
  [1, 3, 5, 7]
]
const bestMoveFn = moves => priorities
  .map(p => intersection(p, moves))
  .find(x => x.length > 0)[0]


const moveFn = (moves, linesFn, allLines) => pipe(
  [linesFn(2, 0), linesFn(0, 2), intersection(linesFn(1, 0), linesFn(0, 1)), allLines]
  .find(ls => ls.length > 0),
  movesFn(moves),
  bestMoveFn)


const blah = (moves, playedMoves, allLines) =>
  moveFn(moves, linesFn(allLines, ...splitMovesFn(playedMoves)), allLines)


const moveAI = game => {
  const moves = game.moves.split('').map(Number)
  const pMoves = game.playedMoves.split('').map(Number)
  const aLines = allLines.map(l => l.split('').map(Number))

  return makeMove(blah(moves, pMoves, aLines), game)
}


module.exports = {
  moveAI: moveAI
}

/**
[1] priorities:
1. make win move
2. block enemy win move
3. block enemy line while making move on own line & [2]
4. just move & [2]

[2] move priorities:
a. center
b. corners
c. other
*/
