const backend = require('./backend')

test('adds 1 + 2 to equal 3', () =>
  expect(backend(1, 2)).toBe(3))
