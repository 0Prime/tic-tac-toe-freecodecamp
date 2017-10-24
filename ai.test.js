const { last, pipe, swap } = require('./tools')
const { visualizeGameField } = require('./testHelpers')

const backend = require('./backend')
const makeMove = backend.makeMove


const newGame = backend.newGame()

const ai = require('./ai')
const moveAI = ai.moveAI


describe('ai', () => {
  it(`first move is center`, () => {
    const game = moveAI(newGame)
    expect(game.playedMoves).toContain(4)
  })


  it(`second to center move is corner`, () => {
    const game = makeMove(4, newGame)

    const expectedMoves = /[0268]/

    expect(moveAI(game).playedMoves).toMatch(expectedMoves)
  })


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
    testMove([4, 0], /[62]/)
  })


  it(`two AI allways tie themselves`, () => {
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

  it(`expected ${gameSoFar.status} to ${expectedMoves}\nfield: ${visualizeGameField(moves)}`, () => {
    const finishedGame = moveAI(gameSoFar)

    expect(finishedGame.playedMoves).toMatch(expectedMoves)
  })
}
