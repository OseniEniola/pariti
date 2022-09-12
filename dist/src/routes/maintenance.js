"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const services_1 = require("../dto/services");
const router = express_1.default.Router();
var coinCollection = services_1.db.collection("coins");
var itemCollection = services_1.db.collection("slotInventory");
var salesCollection = services_1.db.collection("sales");
//Get coins available on the vending machine
router.get("/coins", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = coinCollection.find({}, { _id: 0 });
    // console.log("data",data)
    if (data) {
        res.status(200).json([...data]);
    }
    else {
        res.status(404).json('No coin available');
    }
}));
//Get coins available on the vending machine
router.post("/addproduct", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var product = req.body;
    var products = [...itemCollection.find({})];
    if (product.price < 1) {
        return res.status(400).json('Price cannot be less than $1');
    }
    if (product.quantity < 1) {
        return res.status(400).json('Minimum of 1 product should be added');
    }
    products.forEach(e => {
        if (e.product.itemName.toLowerCase() == product.itemName.toLowerCase()) {
            return res.status(201).json({ "message": "Product already exists" });
        }
    });
    // console.log("data",data)
    if (product) {
        let data = {};
        data.product = product;
        itemCollection.insert(data);
        return res.status(200).json({ "message": "Product added successfully" });
    }
    else {
        return res.status(400).json('Body cannot be empty');
    }
}));
//View total sales and collect money
router.get("/totalsales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = [...salesCollection.find({}, { _id: 0 })];
    var totalSales = 0;
    data.map(e => {
        totalSales += e.amountPaid;
    });
    // console.log("data",data)
    if (data) {
        return res.status(200).json({ "data": [...data], "totalsales": totalSales });
    }
    else {
        return res.status(404).json('No coin available');
    }
}));
//change the number of a coins
router.put("/setcoin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var { number } = req.body;
    var { denomination } = req.body;
    console.log(denomination);
    var coin = coinCollection.find({ denomination: parseFloat(denomination) }, { _id: 0 })[0];
    console.log("coin", coin);
    if (coin) {
        coin.noCoinAvailable = number;
        console.log(coin);
        coinCollection.update(parseFloat(denomination), { noCoinAvailable: coin.noCoinAvailable });
        return res.status(200).json([...coinCollection.find({ denomination: parseFloat(denomination) }, { _id: 0 })]);
    }
    else {
        return res.status(404).json('No coin available');
    }
}));
//change the price of a product
router.put("/setprice/:slotId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var slotId = req.params.slotId;
    var { price } = req.body;
    if (price < 1) {
        return res.status(400).json({ "message": "please input price" });
    }
    var item = itemCollection.find({ slotId: parseInt(slotId) }, { _id: 0 })[0];
    item.product.price = price;
    itemCollection.update({
        slotId: parseInt(slotId)
    }, {
        $overwrite: {
            product: item.product
        }
    });
    return res.status(200).json(itemCollection.find({ slotId: parseInt(slotId) }, { _id: 0 })[0]);
}));
//change the quantity of a product
router.put("/setquantity/:slotId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var slotId = req.params.slotId;
    var { quantity } = req.body;
    if (quantity < 1) {
        return res.status(400).json({ "message": "please input quantity" });
    }
    var item = itemCollection.find({ slotId: parseInt(slotId) }, { _id: 0 })[0];
    item.product.quantity = quantity;
    itemCollection.update({
        slotId: parseInt(slotId)
    }, {
        $overwrite: {
            product: item.product
        }
    });
    return res.status(200).json(itemCollection.find({ slotId: parseInt(slotId) }, { _id: 0 })[0]);
}));
exports.default = router;
