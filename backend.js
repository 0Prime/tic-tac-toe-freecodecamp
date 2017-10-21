// tools
const pipe = (x, f, ...fs) => f ? pipe(f(x), ...fs) : x

const groupBy = (keyFn, xs) =>
  xs.reduce((acc, x) => {
    acc[keyFn(x)] = acc[keyFn(x)].concat(x)
    return acc
  }, {})

const splitBy = (predicate, xs) =>
  Object.values(groupBy(predicate, x))


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


const sortByPlayer = playedMoves =>
  playedMoves
  .split('')
  .reduce((acc, m, i) => {
    acc[i % 2] = acc[i % 2].concat(m)
    return acc
  }, ['', ''])
  .map(l => l.split('').sort().join(''))


const isGameOver = playedMoves =>
  pipe(
    sortByPlayer(playedMoves),
    ([p1, p2]) =>
    allLines.some(line =>
      pipe(
        line.split(''),
        lineArr =>
        lineArr.every(l => p1.includes(l)) ||
        lineArr.every(l => p2.includes(l)))))


const xo = n => n % 2 === 0 ? 'O' : 'X'
const winXO = ({ playedMoves }) => `win of player ${xo(playedMoves.length - 1)}`
const moveXO = ({ moves }) => `move of player ${xo(moves.length)}`


const makeMove = (move, game) =>
  game.moves.split('').some(possibleMove => String(move) === possibleMove) ?
  pipe(
    [game.playedMoves.concat(move), game.moves.replace(move, '')],
    ([playedMoves, moves]) =>
    playedMoves.length === 9 ?
    makeGame('tie', '', playedMoves) :
    isGameOver(playedMoves) ?
    makeGame(winXO(game), '', playedMoves) :
    makeGame(moveXO(game), moves, playedMoves)) :
  game


const backend = {
  newGame: newGame,
  makeMove: makeMove
}

module.exports = backend
