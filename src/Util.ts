export function range(n: number, start: number = 0): number [] {
  return [...Array(n)].map((_, i) => start + i);
}

export function sum(a: number []): number {
  return a.reduce((x, y) => x + y, 0);
}
