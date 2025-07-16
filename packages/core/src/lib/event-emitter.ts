/**
 * Event listener function type.
 */
export type EventListener<T = unknown> = (event: T) => void;

/**
 * Event emitter interface for type-safe event handling.
 */
export type EventEmitter<TEventMap extends Record<string, unknown>> = {
  /**
   * Subscribe to an event.
   * @param event Event name.
   * @param listener Event listener function.
   * @returns Unsubscribe function.
   */
  on<K extends keyof TEventMap>(event: K, listener: EventListener<TEventMap[K]>): () => void;

  /**
   * Unsubscribe from an event.
   * @param event Event name.
   * @param listener Event listener function.
   */
  off<K extends keyof TEventMap>(event: K, listener: EventListener<TEventMap[K]>): void;

  /**
   * Subscribe to an event (one-time).
   * @param event Event name.
   * @param listener Event listener function.
   * @returns Unsubscribe function.
   */
  once<K extends keyof TEventMap>(event: K, listener: EventListener<TEventMap[K]>): () => void;

  /**
   * Emit an event.
   * @param event Event name.
   * @param data Event data.
   */
  emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void;

  /**
   * Remove all listeners for an event.
   * @param event Event name (optional, if not provided, removes all listeners).
   */
  removeAllListeners<K extends keyof TEventMap>(event?: K): void;
};

/**
 * Base implementation of EventEmitter.
 */
export class BaseEventEmitter<TEventMap extends Record<string, unknown>> implements EventEmitter<TEventMap> {
  private listeners = new Map<keyof TEventMap, Set<EventListener<TEventMap[keyof TEventMap]>>>();
  private onceListeners = new Map<keyof TEventMap, Set<EventListener<TEventMap[keyof TEventMap]>>>();

  on<K extends keyof TEventMap>(event: K, listener: EventListener<TEventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as EventListener<TEventMap[keyof TEventMap]>);

    return () => this.off(event, listener);
  }

  off<K extends keyof TEventMap>(event: K, listener: EventListener<TEventMap[K]>): void {
    this.listeners.get(event)?.delete(listener as EventListener<TEventMap[keyof TEventMap]>);
    this.onceListeners.get(event)?.delete(listener as EventListener<TEventMap[keyof TEventMap]>);
  }

  once<K extends keyof TEventMap>(event: K, listener: EventListener<TEventMap[K]>): () => void {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }
    this.onceListeners.get(event)!.add(listener as EventListener<TEventMap[keyof TEventMap]>);

    // Also add to regular listeners
    return this.on(event, listener);
  }

  emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void {
    // Call regular listeners
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${String(event)}:`, error);
        }
      }
    }

    // Remove once listeners after calling
    const onceListeners = this.onceListeners.get(event);
    if (onceListeners) {
      for (const listener of onceListeners) {
        this.off(event, listener);
      }
    }
  }

  removeAllListeners<K extends keyof TEventMap>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
      this.onceListeners.delete(event);
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
    }
  }
}
