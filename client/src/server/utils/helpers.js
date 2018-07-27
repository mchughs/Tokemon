const intersect = (a, b) => {
  return [...a].filter(x => b.includes(x))
}

const difference = (a, b) => {
  const notInB = [...a].filter(x => !b.includes(x))
  const notInA = [...b].filter(x => !a.includes(x))
  return [...notInA, ...notInB]
}

module.exports = {intersect, difference}
