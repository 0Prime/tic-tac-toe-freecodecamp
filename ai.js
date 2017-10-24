const { pipe, splitBy, swap, curry } = require('./tools')
const { makeMove, allLines } = require('./backend')


const isEven = x => x % 2 === 0
const isOdd = x => x % 2 !== 0


const numberOfMovesPlayedInLine = (moves, line) =>
  line && moves ? line.split('').filter(cell => moves.includes(cell)).length : 0


const isWinningLine = (moves, line) =>
  numberOfMovesPlayedInLine(moves, line) === 2


const moveAI = game => {
  const center = '4'
  const { playedMoves, moves } = game

  if (moves.includes(center))
    return makeMove(center, game)

  const isXMove = isEven(playedMoves.length)
  const [xMoves, oMoves] = splitBy((x, i) => isEven(i), playedMoves.split(''))
  const [ownMoves, enemyMoves] = isXMove ? [xMoves, oMoves] : [oMoves, xMoves]


  const winningMove = playerMoves => moves.split('').find(move => allLines.find(curry(isWinningLine, playerMoves)) && allLines.find(curry(isWinningLine, playerMoves)).includes(move))


  const [ownWinningMove, enemyWinningMove] = [ownMoves, enemyMoves].map(winningMove)


  if (ownWinningMove)
    return makeMove(ownWinningMove, game)
  if (enemyWinningMove)
    return makeMove(enemyWinningMove, game)


  const affectedLines = move => allLines.filter(l => l.split('').includes(move))


  const hasAffectedLineWithParams = (ownMovesCount, enemyMovesCount, move) =>
    affectedLines(move).find(line =>
      numberOfMovesPlayedInLine(ownMoves, line) === ownMovesCount &&
      numberOfMovesPlayedInLine(enemyMoves, line) === enemyMovesCount) !== undefined


  const hasAffectedLineWithOnlyOneOwnMark = curry(hasAffectedLineWithParams, 1, 0)
  const hasAffectedLineWithOnlyOneEnemyMark = curry(hasAffectedLineWithParams, 0, 1)


  const blockWinMoves = moves.split('').filter(m => hasAffectedLineWithOnlyOneOwnMark(m) && hasAffectedLineWithOnlyOneEnemyMark(m))


  const corners = '0268'


  const aiMove = (blockWinMoves.length > 0 ?
    blockWinMoves.filter(m => corners.includes(m)).length > 0 ?
    blockWinMoves.filter(m => corners.includes(m)) : blockWinMoves :
    moves.split('').filter(m =>
      corners.includes(m)).length > 0 ? moves.split('').filter(m =>
      corners.includes(m)) :
    moves.split(''))[0]

  return makeMove(aiMove, game)
}


module.exports = {
  moveAI: moveAI
}
