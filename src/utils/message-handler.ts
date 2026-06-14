/**
 * Message handling utilities for WebSocket and event-based communication
 */

/**
 * Type-safe message router
 * Maps message types to handler functions
 */
export class MessageRouter<T extends { type: string }> {
  private handlers: Map<string, (message: T) => void> = new Map();

  /**
   * Register a handler for a specific message type
   */
  on<K extends T['type']>(
    type: K,
    handler: (message: Extract<T, { type: K }>) => void
  ): void {
    this.handlers.set(type, handler as (message: T) => void);
  }

  /**
   * Unregister a handler
   */
  off(type: T['type']): void {
    this.handlers.delete(type);
  }

  /**
   * Route a message to the appropriate handler
   */
  route(message: T): void {
    const handler = this.handlers.get(message.type);
    if (handler) {
      try {
        handler(message);
      } catch (error) {
        console.error(`Error handling message type ${message.type}:`, error);
      }
    }
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Get registered handler count
   */
  size(): number {
    return this.handlers.size;
  }
}

/**
 * Batch message processing
 * Useful for debouncing or batching similar message types
 */
export class MessageBatcher<T extends { type: string }> {
  private queue: T[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private batchSize: number;
  private delayMs: number;
  private onBatch: (messages: T[]) => void;

  constructor(batchSize = 10, delayMs = 100, onBatch: (messages: T[]) => void = () => {}) {
    this.batchSize = batchSize;
    this.delayMs = delayMs;
    this.onBatch = onBatch;
  }

  /**
   * Add a message to the batch
   */
  add(message: T): void {
    this.queue.push(message);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.delayMs);
    }
  }

  /**
   * Process the current batch
   */
  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length > 0) {
      const batch = this.queue;
      this.queue = [];
      this.onBatch(batch);
    }
  }

  /**
   * Clear the batch queue
   */
  clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.queue = [];
  }

  /**
   * Get current queue size
   */
  size(): number {
    return this.queue.length;
  }
}

/**
 * Message deduplicator
 * Prevents processing duplicate messages within a time window
 */
export class MessageDeduplicator<T extends { type: string }> {
  private seen: Map<string, number> = new Map();
  private windowMs: number;

  constructor(windowMs = 1000) {
    this.windowMs = windowMs;
  }

  /**
   * Check if message is a duplicate
   */
  isDuplicate(messageId: string): boolean {
    const lastSeen = this.seen.get(messageId);
    if (!lastSeen) {
      this.seen.set(messageId, Date.now());
      return false;
    }

    if (Date.now() - lastSeen < this.windowMs) {
      return true;
    }

    this.seen.set(messageId, Date.now());
    return false;
  }

  /**
   * Clear old entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [id, time] of this.seen.entries()) {
      if (now - time > this.windowMs) {
        this.seen.delete(id);
      }
    }
  }

  /**
   * Reset deduplicator
   */
  reset(): void {
    this.seen.clear();
  }
}
