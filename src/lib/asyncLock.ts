export class AsyncLock {
  private promise: Promise<void> = Promise.resolve();

  async acquire(): Promise<() => void> {
    let release!: () => void;
    const next = new Promise<void>((resolve) => {
      release = resolve;
    });
    const current = this.promise;
    this.promise = current.then(() => next);
    await current;
    return release;
  }
}
