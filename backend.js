const { pipe, autoCurry, isEven, splitBy } = require('./tools')


const makeGame = (status, moves, playedMoves) => ({
  status: status,
  moves: moves,
  playedMoves: playedMoves
})


const newGame = () => makeGame('move of player X', '012345678', '')


const allLines = [
  '012', '345', '678',
  '036', '147', '258',
  '048', '246'
]


const movesInLineCount = (moves, line) => moves && line ?
  moves.filter(m => line.includes(m)).length : 0


const splitToXO = moves => splitBy((x, i) => isEven(i), moves)


const canonize = s => s.split('').map(Number)


const isGameOver = moves => pipe(
  splitToXO(moves),
  ([xMoves, oMoves]) =>
  allLines.find(l =>
    movesInLineCount(xMoves, l) === 3 ||
    movesInLineCount(oMoves, l) === 3))


const xo = n => isEven(n) ? 'X' : 'O'
const winXO = moves => `win of player ${xo(moves.length)}`
const moveXO = moves => `move of player ${xo(moves.length)}`


const makeMove = autoCurry((move, game) =>
  canonize(game.moves).includes(move) ? pipe(
    [game.playedMoves.concat(move), game.moves.replace(move, '')],
    ([newPlayedMoves, newMoves]) =>
    newPlayedMoves.length === 9 ? makeGame('tie', '', newPlayedMoves) :
    isGameOver(canonize(newPlayedMoves)) ? makeGame(winXO(game.playedMoves), '', newPlayedMoves) :
    makeGame(moveXO(game.moves), newMoves, newPlayedMoves)) :
  game)


module.exports = {
  newGame: newGame,
  makeMove: makeMove,
  allLines: allLines,
  splitToXO: splitToXO,
  movesInLineCount: movesInLineCount,
  canonize: canonize,
  xo: xo
}
