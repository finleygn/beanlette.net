export function delay(timeoutMs: number) {
  return new Promise<void>(res => setTimeout(() => res(), timeoutMs));
}