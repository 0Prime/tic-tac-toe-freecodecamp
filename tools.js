const pipe = (x, f, ...fs) => f ? pipe(f(x), ...fs) : x


const swap = f => (a, b) => f(b, a)


const curry = (f, ...args) => f.bind(undefined, ...args)


const groupBy = (keyFn, xs) =>
  xs.reduce((acc, x) => {
    acc[keyFn(x)] = acc[keyFn(x)].concat(x)
    return acc
  }, {})


const splitBy = (predicate, xs) =>
  Object.values(groupBy(predicate, x))


module.exports = {
  pipe: pipe,
  swap: swap,
  curry: curry,
  groupBy: groupBy,
  splitBy: splitBy
}
