export function reportError(error: unknown, context?: string) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(context ? `[${context}] ${message}` : message, error);
}
