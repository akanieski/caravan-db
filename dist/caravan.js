"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const processArgs = require("command-line-args");
const optionDefinitions = [
    { name: 'connection', alias: 'c', type: String }
];
let args = processArgs(optionDefinitions);
if (!args.connection) {
    throw new Error("Connection info is required!");
}
//# sourceMappingURL=caravan.js.map