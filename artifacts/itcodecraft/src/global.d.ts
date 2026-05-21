export {};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    productName?: string;
    itccTrack?: (
      event: string,
      label?: string,
      opts?: { skipThrottle?: boolean },
    ) => void;
  }
}
