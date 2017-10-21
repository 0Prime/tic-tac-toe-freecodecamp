const backend = require('./backend')

// tools
const swap = f => (a, b) => f(b, a)
const pipe = (x, f, ...fs) => f ? pipe(f(x), ...fs) : x

const newGame = backend.newGame()

const makeMove = backend.makeMove

/*
TODO: game field to win conditions function for testing
`
xo-
xo-
x--
`
*/
describe('game has correct status', () => {
  describe('`X` player wining game has `X` in it`s status', () => {
    const testWinX = testCorrectStatus.bind(null, 'status contains `X`', 'X')

    testWinX([0, 3, 1, 4, 2])
  })


  describe('`O` player wining game has `O` in it`s status', () => {
    const testWinO = testCorrectStatus.bind(null, 'status contains `O`', 'O')

    testWinO([0, 3, 1, 4, 6, 5])
  })


  describe('winning games`s status contains `win`', () => {
    const testWin = testCorrectStatus.bind(null, 'status contains `win`', 'win')

    testWin([0, 3, 1, 4, 2])
    testWin([0, 1, 3, 4, 6])
    testWin([0, 1, 4, 2, 7, 5, 8])
    testWin([0, 3, 1, 4, 6, 5])
  })


  describe('ongoing game`s status contains `move`', () => {
    const testOngoing = testCorrectStatus.bind(null, 'status contains `move`', 'move')

    testOngoing([0])
    testOngoing([0, 1])
    testOngoing([0, 1, 2])
    testOngoing([0, 1, 2, 3])
    testOngoing([0, 1, 2, 3, 4])
  })

  describe('tied game`s status contains `tie`', () => {
    const testTie = testCorrectStatus.bind(null, 'status contains `tie`', 'tie')

    testTie([0, 1, 2, 3, 5, 4, 6, 8, 7])
    testTie([0, 1, 2, 4, 3, 5, 7, 6, 8])
  })

  function testCorrectStatus(statement, expectedStatus, movesSequence) {
    it(`${statement}, moves:${movesSequence}`, () =>
      pipe(
        movesSequence.reduce(swap(makeMove), newGame),
        game => expect(game.status).toContain(expectedStatus)))
  }
})


describe('player can`t play illegal moves', () => {
  testIllegalMove(9)
  testIllegalMove(12)
  testIllegalMove(0, [0])
  testIllegalMove(0, [0, 1, 2])
  testIllegalMove(42, [1, 2, 3, 4])
  testIllegalMove(4, [0, 3, 1, 4, 6, 5])

  function testIllegalMove(illegalMove, playedMoves) {
    it(`illegal move '${illegalMove}' is ignored, moves: ${playedMoves || "new game"}`, () => {
      const gameSoFar = playedMoves ? playedMoves.reduce(swap(makeMove), newGame) : newGame
      const afterIllegalMove = makeMove(illegalMove, gameSoFar)

      expect(afterIllegalMove.playedMoves.length).toBe(gameSoFar.playedMoves.length)
    })
  }
})


// players make moves in turns
// each player has own type of mark
// win condition: 3 marks in 1 row, horizontally, vertically or diagonally

// ... after each move game recalculates it's state:
// move of one of the players or win of one of players or tie
