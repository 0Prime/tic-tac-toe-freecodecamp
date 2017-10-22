const { pipe, swap, curry } = require('./tools')


const backend = require('./backend')
const makeMove = backend.makeMove


const newGame = backend.newGame()


describe('game has correct status', () => {
  describe('`X` player wining game has `X` in it`s status', () => {
    const testWinX = curry(testCorrectStatus, 'status contains `X`', 'X')

    testWinX([0, 3, 1, 4, 2])
  })


  describe('`O` player wining game has `O` in it`s status', () => {
    const testWinO = curry(testCorrectStatus, 'status contains `O`', 'O')

    testWinO([0, 3, 1, 4, 6, 5])
  })


  describe('winning games`s status contains `win`', () => {
    const testWin = curry(testCorrectStatus, 'status contains `win`', 'win')

    testWin([0, 3, 1, 4, 2])
    testWin([0, 1, 3, 4, 6])
    testWin([0, 1, 4, 2, 7, 5, 8])
    testWin([0, 3, 1, 4, 6, 5])
  })


  describe('ongoing game`s status contains `move`', () => {
    const testOngoing = curry(testCorrectStatus, 'status contains `move`', 'move')

    testOngoing([0])
    testOngoing([0, 1])
    testOngoing([0, 1, 2])
    testOngoing([0, 1, 2, 3])
    testOngoing([0, 1, 2, 3, 4])
  })

  describe('tied game`s status contains `tie`', () => {
    const testTie = curry(testCorrectStatus, 'status contains `tie`', 'tie')

    testTie([0, 1, 2, 3, 5, 4, 6, 8, 7])
    testTie([0, 1, 2, 4, 3, 5, 7, 6, 8])
  })

  function testCorrectStatus(statement, expectedStatus, moves) {
    it(`${statement}, moves:${moves}, field:${visualizeGameField(moves)}`, () =>
      pipe(
        moves.reduce(swap(makeMove), newGame),
        game => expect(game.status).toContain(expectedStatus)))
  }
})

// ДОПИЛИТЬ ВИЖУАЛ ТЕСТОВ, ПОПРАВИТЬ СТРОКИ
describe('player can`t play illegal moves', () => {
  testIllegalMove(9)
  testIllegalMove(12)
  testIllegalMove(0, [0])
  testIllegalMove(0, [0, 1, 2])
  testIllegalMove(42, [1, 2, 3, 4])
  testIllegalMove(4, [0, 3, 1, 4, 6, 5])

  function testIllegalMove(illegalMove, playedMoves) {
    it(`illegal move '${illegalMove}' is ignored\nmoves: ${playedMoves || 'new game'}\nfield:${visualizeGameField(playedMoves)}`, () => {
      const gameSoFar = playedMoves ? playedMoves.reduce(swap(makeMove), newGame) : newGame
      const afterIllegalMove = makeMove(illegalMove, gameSoFar)

      expect(afterIllegalMove.playedMoves.length).toBe(gameSoFar.playedMoves.length)
    })
  }
})


function visualizeGameField(moves) {
  const xo = n => n % 2 === 0 ? 'X' : 'O'
  const addNewLines = (acc, x, i) => acc.concat(i % 3 == 0 ? `\n${x}` : x)

  return pipe(
    '---------'.split(''),
    field => !moves ? field :
    field.map((x, i) => moves.some(m => m == i) ? xo(i) : x),
    field => field.reduce(addNewLines, []),
  ).join('')
}
