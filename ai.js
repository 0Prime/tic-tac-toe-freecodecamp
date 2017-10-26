const { pipe, splitBy, intersection, autoCurry, sortPair, isEven, swap } = require('./tools')
const { splitToXO, movesInLineCount, canonize } = require('./backend')

const backend = require('./backend')
const allLines = backend.allLines.map(canonize)
const makeMove = swap(backend.makeMove)


const priorities = ['4', '0268', '1357'].map(canonize)
const chooseBestMove = moves => priorities
  .map(p => intersection(p, moves))
  .find(x => x.length > 0)[0]


const findMoves = autoCurry((moves, lines) =>
  moves.filter(m => lines.some(l => l.includes(m))))


const splitToOwnAndEnemy = moves =>
  sortPair(isEven(moves.length), splitToXO(moves))


const findLinesByMovesCount = autoCurry((aMoves, bMoves, aCount, bCount) =>
  allLines.filter(l =>
    movesInLineCount(aMoves, l) === aCount &&
    movesInLineCount(bMoves, l) === bCount))


const findMove = (moves, playedMoves) => pipe(
  findLinesByMovesCount(...splitToOwnAndEnemy(playedMoves)),
  findLines => pipe(
    [findLines(2, 0), findLines(0, 2), intersection(findLines(1, 0), findLines(0, 1)), allLines]
    .find(ls => ls.length > 0),
    findMoves(moves),
    chooseBestMove))


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
