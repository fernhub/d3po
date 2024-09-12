export class SQLError extends Error {
  public override readonly stack;

  constructor(opts: { message: string; stack?: string }) {
    super(opts.message);
    this.stack = opts.stack;
    this.name = "SQLError";
  }
}
