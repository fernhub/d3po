export class SQLError extends Error {
  public readonly stack;

  constructor(opts: { message: string; stack?: string }) {
    super(opts.message);
    this.stack = opts.stack;
    this.name = "SQLError";
  }
}
