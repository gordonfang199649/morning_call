"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
(async function () {
    try {
        await mongoose_1.connect("mongodb://localhost:27017/dailyInform", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('successfully connected with mongodb');
    }
    catch (error) {
        console.log(error);
        mongoose_1.disconnect();
    }
})();
//# sourceMappingURL=connect.js.map