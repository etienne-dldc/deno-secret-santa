export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let index = 0; index < copy.length; index++) {
    const i1 = Math.floor(Math.random() * copy.length);
    const i2 = Math.floor(Math.random() * copy.length);
    if (i1 !== i2) {
      const tmp = copy[i2];
      copy[i2] = copy[i1];
      copy[i1] = tmp;
    }
  }
  return copy;
}
