type Listener = () => void;

export abstract class SyncedStore<T = Record<string, unknown>> {
  private listeners = new Set<Listener>();
  private cachedSnapshot: T | null = null;

  /**
   * Notify all subscribers that the data has changed.
   * This method should be called whenever the data changes.
   */
  protected notify(): void {
    // Clear cache when data changes
    this.cachedSnapshot = null;
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Subscribe to changes in the store.
   * Returns a function to unsubscribe.
   *
   * @param listener - The function to call when the data changes.
   */
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get the current snapshot of the store.
   * This method should be called to get the current state of the data.
   *
   * @returns The current data in the store.
   */
  public getSnapshot(): T {
    // Return cached snapshot if available, otherwise create and cache new one
    if (!this.cachedSnapshot) {
      this.cachedSnapshot = this.getData();
    }
    return this.cachedSnapshot;
  }

  /**
   * Get the current data from the store.
   * This method should be implemented by subclasses to return the actual data.
   *
   * @returns The current data in the store.
   */
  protected abstract getData(): T;

  /**
   * Set the data in the store.
   * This method should be implemented by subclasses to set the actual data.
   *
   * @param data - The new data to set in the store.
   */
  protected setLocalStorage(key: string, value: unknown): void {
    // Return early during SSR/static generation.
    // This is needed to prevent errors when using localStorage in a server-side
    // rendered environment.
    if (typeof window === "undefined") return;

    // eslint-disable-next-line no-restricted-syntax
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }

  /**
   * Get data from localStorage with a fallback to a default value.
   * If the data is not found or cannot be parsed, the default value is returned.
   *
   * @param key - The key to retrieve from localStorage.
   * @param defaultValue - The default value to return if the key is not found or parsing fails.
   * @returns The parsed value from localStorage or the default value.
   */
  protected getLocalStorage<U = unknown>(key: string, defaultValue: U): U {
    // Return early during SSR/static generation.
    // This is needed to prevent errors when using localStorage in a server-side
    // rendered environment.
    if (typeof window === "undefined") return defaultValue;

    // eslint-disable-next-line no-restricted-syntax
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;

    try {
      return JSON.parse(stored) as U;
    } catch {
      return stored as U; // Return as string if not JSON
    }
  }
}
