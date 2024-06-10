export default function delay(minMs: number, maxMs: number): Promise<void> {
  const randomMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, randomMs));
}
