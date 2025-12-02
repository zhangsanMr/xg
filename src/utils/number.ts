export function randomFloatBetween1And3Percent(value: number): number {
  if (!Number.isFinite(value)) return value

  const sign = Math.random() < 0.5 ? -1 : 1
  const percent = 1 + Math.floor(Math.random() * 3)
  const delta = (percent / 100) * sign

  return value * (1 + delta)
}

export function randomFloatByPercent(value: number, minPercent = 1, maxPercent = 3, allowNegative = true): number {
  if (!value) return value

  if (minPercent < 0 || maxPercent < minPercent) return value

  const percent = minPercent + Math.random() * (maxPercent - minPercent)
  const sign = allowNegative && Math.random() < 0.5 ? -1 : 1
  const delta = (percent / 100) * sign

  return Number((value * (1 + delta)).toFixed(4))
}
