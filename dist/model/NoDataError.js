"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoDataError';
    }
}
exports.default = NoDataError;
//# sourceMappingURL=NoDataError.js.map