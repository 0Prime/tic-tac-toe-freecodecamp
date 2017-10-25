const pipe = (x, f, ...fs) => f ? pipe(f(x), ...fs) : x


const swap = f => (a, b) => f(b, a)


const curry = (f, ...args) => f.bind(undefined, ...args)


const autoCurry = f => function() {
  const args = Array.from(arguments)
  return args.length < f.length ?
    autoCurry(f.bind(undefined, ...args)) :
    f(...args)
}


const last = xs => xs[xs.length - 1]


const groupBy = (keyFn, xs) =>
  xs.reduce((acc, x, i) => {
    const key = keyFn(x, i)
    acc[key] = (acc[key] || []).concat(x)
    return acc
  }, {})


const splitBy = (predicate, xs) => xs.length > 0 ?
  pipe(groupBy(predicate, xs), Object.values) : [
    [],
    []
  ]


const intersection = (xs, ys) => xs.filter(x => ys.includes(x))


const sortPair = autoCurry((predicate, [x, y]) => predicate ? [x, y] : [y, x])


const isEven = x => x % 2 === 0
const isOdd = x => x % 2 !== 0


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
  isOdd: isOdd
}
