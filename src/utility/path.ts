export function pathcmp(a: string, b: string) {
  return a === b || a + "/" === b;
}

export function path_append(a: string, b: string) {
  if (a.endsWith("/")) {
    return a + b;
  }
  return a + "/" + b;
}
