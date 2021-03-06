const pipe = (x, f, ...fs) => f ? pipe(f(x), ...fs) : x


const curry = (f, ...args) => f.bind(undefined, ...args)


const autoCurry = f => function() {
  const args = Array.from(arguments)
  return args.length < f.length ?
    autoCurry(f.bind(undefined, ...args)) :
    f(...args)
}


const swap = autoCurry((f, a, b) => f(b, a))


const last = xs => xs[xs.length - 1]


const groupBy = (keyFn, xs) =>
  xs.reduce((acc, x, i) => {
    const key = keyFn(x, i)
    acc[key] = (acc[key] || []).concat(x)
    return acc
  }, {})


const splitBy = (predicate, xs) =>
  pipe(groupBy(predicate, xs), Object.values)


const intersection = autoCurry((xs, ys) => xs.filter(x => ys.includes(x)))


const sortPair = autoCurry((predicate, [x, y]) => predicate ? [x, y] : [y, x])


const isEven = x => x % 2 === 0
const isOdd = x => x % 2 !== 0


const equals = autoCurry((xs, ys) =>
  xs.length === ys.length && xs.every((x, i) => x === ys[i]))


const anyOf = xs => xs[Math.floor(Math.random() * xs.length)]


module.exports = {
  pipe: pipe,
  swap: swap,
  curry: curry,
  autoCurry: autoCurry,
  last: last,
  groupBy: groupBy,
  splitBy: splitBy,
  intersection: intersection,
  sortPair: sortPair,
  isEven: isEven,
  isOdd: isOdd,
  equals: equals,
  anyOf: anyOf
}
