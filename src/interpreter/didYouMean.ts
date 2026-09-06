/* Suggesting a command three edits away is worse than suggesting nothing. */
function distance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i]

    for (let j = 1; j <= b.length; j += 1) {
      const substitution = a[i - 1] === b[j - 1] ? 0 : 1

      current[j] = Math.min(
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
        (previous[j - 1] ?? 0) + substitution,
      )
    }

    previous = current
  }

  return previous[b.length] ?? 0
}

export function didYouMean(
  input: string,
  candidates: string[],
  maxDistance = 3,
): string | null {
  let best: string | null = null
  let bestDistance = maxDistance + 1

  for (const candidate of candidates) {
    const d = distance(input, candidate)

    if (d < bestDistance) {
      bestDistance = d
      best = candidate
    }
  }

  return bestDistance <= maxDistance ? best : null
}
