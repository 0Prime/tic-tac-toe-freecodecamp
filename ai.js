const { pipe, splitBy, intersection, autoCurry, sortPair, isEven, swap, equals, anyOf } = require('./tools')
const { splitToXO, movesInLineCount, canonize } = require('./backend')

const backend = require('./backend')
const allLines = backend.allLines.map(canonize)
const makeMove = swap(backend.makeMove)


const field = { center: [4], corners: [0, 2, 6, 8], other: [1, 3, 5, 7] }
const priorities = pipe(field, ({ center, corners, other }) => [center, corners, other])
const chooseBestMove = autoCurry((oMoves, eMoves, moves) => anyOf([
    [2, 6],
    [0, 8]
  ]
  .some(ms => eMoves && equals(ms, eMoves.sort())) && moves.length === 6 ? field.other :
  priorities
  .map(p => intersection(p, moves))
  .find(x => x.length > 0)))


const findMoves = autoCurry((moves, lines) =>
  moves.filter(m => lines.some(l => l.includes(m))))


const splitToOwnAndEnemy = moves =>
  sortPair(isEven(moves.length), splitToXO(moves))


const findLinesByMovesCount = autoCurry((oMoves, eMoves, oCount, eCount) =>
  allLines.filter(l =>
    movesInLineCount(oMoves, l) === oCount &&
    movesInLineCount(eMoves, l) === eCount))


const findMove = (moves, playedMoves) => pipe(
  findLinesByMovesCount(...splitToOwnAndEnemy(playedMoves)),
  findLines => pipe(
    [findLines(2, 0), findLines(0, 2), intersection(findLines(1, 0), findLines(0, 1)), allLines]
    .find(ls => ls.length > 0),
    findMoves(moves),
    chooseBestMove(...splitToOwnAndEnemy(playedMoves))))


/**
 * priorities:
 * 1. make win move
 * 2. block enemy win move
 * 3. block enemy line while making move on own line
 * 4. just move

 * move priorities:
 * a. center
 * b. corners
 * c. other
 */
const moveAI = game => pipe(
  findMove(canonize(game.moves), canonize(game.playedMoves)),
  makeMove(game))


module.exports = {
  moveAI: moveAI
}
