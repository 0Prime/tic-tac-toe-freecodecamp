const { pipe, swap, last } = require('./tools')
const { visualizeGameField } = require('./testHelpers')

const backend = require('./backend')
const makeMove = backend.makeMove


const newGame = backend.newGame()

const { moveAI } = require('./ai')


describe(`ai`, () => {
  describe(`first move is center`, () =>
    testMove([], /[4]/))


  describe(`second to center move is corner`, () =>
    testMove([4], /[0268]/))


  describe(`is making winning moves`, () => {
    testMove([0, 1, 3, 4], /[6]/)
    testMove([0, 3, 1, 4], /[2]/)
    testMove([0, 1, 3, 4, 8], /[7]/)
    testMove([4, 0, 5, 3, 1], /[6]/)
  })


  describe(`is blocking enemy's winning moves`, () => {
    testMove([4, 0, 5], /[3]/)
    testMove([4, 0, 1], /[7]/)
    testMove([4, 1, 3], /[5]/)
  })


  describe(`is creating wining move while blocking enemy at same time`, () => {
    testMove([4, 0], /[268]/)
    testMove([4, 6], /[028]/)
    testMove([2, 4], /[068]/)
  })


  describe(`is blocking diagonal double threat`, () => {
    const testFor = moves => testMove(moves, /[1357]/)
    testFor([6, 4, 2])
    testFor([2, 4, 6])
    testFor([0, 4, 8])
    testFor([8, 4, 0])
  })


  it(`two AI tie themselves`, () => {
    const finishedGame = pipe(
      newGame,
      moveAI, moveAI, moveAI,
      moveAI, moveAI, moveAI,
      moveAI, moveAI, moveAI)

    expect(`${finishedGame.status}\nmoves:${finishedGame.playedMoves}${visualizeGameField(finishedGame.playedMoves.split(''))}`).toContain('tie')
  })
})


function testMove(moves, expectedMoves) {
  const gameSoFar = moves.reduce(swap(makeMove), newGame)

  it(`expected ${gameSoFar.status} to ${expectedMoves}\nmoves: ${gameSoFar.playedMoves}\nfield: ${visualizeGameField(moves)}`, () => {
    const finishedGame = moveAI(gameSoFar)

    expect(last(finishedGame.playedMoves)).toMatch(expectedMoves)
  })
}
