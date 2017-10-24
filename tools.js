const pipe = (x, f, ...fs) => f ? pipe(f(x), ...fs) : x


const swap = f => (a, b) => f(b, a)


const curry = (f, ...args) => f.bind(undefined, ...args)


const last = xs => xs[xs.length - 1]


const groupBy = (keyFn, xs) =>
  xs.reduce((acc, x, i) => {
    const key = keyFn(x, i)
    acc[key] = (acc[key] || []).concat(x)
    return acc
  }, {})


const splitBy = (predicate, xs) =>
  pipe(groupBy(predicate, xs), Object.values)



module.exports = {
  pipe: pipe,
  swap: swap,
  curry: curry,
  last: last,
  groupBy: groupBy,
  splitBy: splitBy
}
