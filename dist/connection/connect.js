"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnection = exports.connection = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const mongoose_1 = require("mongoose");
const connection = async () => {
    try {
        await mongoose_1.connect(process.env.DB_SERVER, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('successfully connected with mongodb');
    }
    catch (error) {
        console.error(error);
        await mongoose_1.disconnect();
        console.log('disconnected with mongodb.');
    }
};
exports.connection = connection;
const disconnection = async () => {
    await mongoose_1.disconnect();
    console.log('disconnected with mongodb.');
};
exports.disconnection = disconnection;
//# sourceMappingURL=connect.js.map