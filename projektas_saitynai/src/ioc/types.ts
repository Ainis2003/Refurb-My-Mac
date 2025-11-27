const TYPES = {
  authService: Symbol.for('authService'),
  authRepository: Symbol.for('authRepository'),
  database: Symbol.for('database'),
  makeRepository: Symbol.for('makeRepository'),  // ADDED THIS
  makeService: Symbol.for('makeService'),  // ADDED THIS
  modelRepository: Symbol.for('modelRepository'),  // ADD THIS
  modelService: Symbol.for('modelService'),        // ADD THIS
  computerRepository: Symbol.for('computerRepository'),  // ADD THIS
  computerService: Symbol.for('computerService')        // ADD THIS
};

export { TYPES };
