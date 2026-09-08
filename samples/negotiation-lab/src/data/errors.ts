export class NegotiationDataError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'NegotiationDataError';
  }
}

export class NegotiationConflictError extends NegotiationDataError {
  public constructor() {
    super('This practice changed in another board. Reload it and try again.');
    this.name = 'NegotiationConflictError';
  }
}

export class NegotiationSchemaMissingError extends NegotiationDataError {
  public constructor() {
    super('Negotiation Lab lists are not ready. Run Set up lists first.');
    this.name = 'NegotiationSchemaMissingError';
  }
}
