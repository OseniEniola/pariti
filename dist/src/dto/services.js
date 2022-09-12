"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadData = exports.db = void 0;
const products_json_1 = __importDefault(require("./products.json"));
const coins_json_1 = __importDefault(require("./coins.json"));
var ForerunnerDB = require("forerunnerdb");
var fdb = new ForerunnerDB();
exports.db = fdb.db("myDatabaseName");
var itemCollection = exports.db.collection("slotInventory", { primaryKey: "slotId" });
var coinCollection = exports.db.collection("coins", { primaryKey: "denomination" });
coinCollection.primaryKey("denomination");
function loadData() {
    const prod = products_json_1.default;
    const configuredCoins = coins_json_1.default;
    var slot = [];
    prod.forEach((element, index) => {
        var item = { slotId: index + 1, product: element };
        slot.push(item);
    });
    coinCollection.insert(configuredCoins);
    itemCollection.insert(slot);
}
exports.loadData = loadData;
